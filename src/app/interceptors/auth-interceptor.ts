import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

// پرچم وضعیت: آیا در همین لحظه یک درخواست رفرش توکن فعال در بک‌اند داریم؟
let isRefreshing = false;

// صف انتظار دیجیتالی: تمام درخواست‌های موازی فاقد توکن در این سابجکت منتظر می‌مانند
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * authInterceptor
 * @description اینترسپتور اصلی احراز هویت جهت تزریق توکن‌ها و مدیریت خطای انقضای 401.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);

  // 🛡️ گارد محافظتی اصلی: اگر مسیر شامل لاگین یا رفرش توکن بود، اینترسپتور نباید کاری انجام دهد
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  // دریافت آخرین اکسس توکن معتبر از سرویس
  const accessToken = authService.getAccessToken();

  let authReq = req;

  // اگر توکن موجود بود، آن را به هدر درخواست الصاق (تزریق) می‌کنیم
  if (accessToken) {
    authReq = injectToken(req, accessToken);
  }

  // ارسال درخواست به شبکه و مانیتور کردن خطاهای احتمالی پاسخ
  return next(authReq).pipe(
    catchError((error) => {
      // 🚨 بررسی وقوع خطای ۴۰۱ (انقضای توکن)
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // ارجاع به تابع اصلی مدیریت تمدید توکن پشت‌صحنه
        return handle401Error(authReq, next, authService);
      }
      // عبور دادن خطاهای دیگر اپلیکیشن (مانند خطای سرور ۵۰۰ یا خطای ۴۰۴) بدون تغییر
      return throwError(() => error);
    }),
  );
};

/**
 * injectToken
 * @description تزریق کردن توکن به هدر Authorization به فرمت استاندارد Bearer Token.
 * @param req HttpRequest<any> - درخواست اصلی
 * @param token string - توکن اعتبارسنجی
 * @returns HttpRequest<any> - درخواست شبیه‌سازی شده جدید همراه با هدر امنیت
 */
function injectToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

/**
 * handle401Error
 * @description مدیریت معماری صف انتظار درخواست‌ها و صدا زدن متد تمدید توکن در بک‌اند.
 */
function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthenticationService,
): Observable<any> {
  // ─── حالت اول: ما اولین درخواستی هستیم که ارور ۴۰۱ را کشف کرده‌ایم ───
  if (!isRefreshing) {
    isRefreshing = true; // قفل کردن پرچم تا بقیه درخواست‌ها بدانند یک پروسه رفرش شروع شده
    refreshTokenSubject.next(null); // پاکسازی و آماده‌سازی سالن انتظار دیجیتالی

    // ارسال درخواست تمدید توکن به سرور
    return authService.refreshToken().pipe(
      switchMap((res: any) => {
        isRefreshing = false; // باز کردن قفل پرچم پس از دریافت توکن جدید

        // همسان‌سازی نام فیلد توکن دریافتی از سرور (پشتیبانی از فرمت‌های مختلف بک‌اند)
        const newToken = res.accessToken || res.token;

        authService.updateAccessToken(newToken);
        refreshTokenSubject.next(newToken); // بوق زدن و فرستادن سیگنال توکن جدید به تمام درخواست‌های منتظر در صف

        // تکرار خودکار درخواست اولیه شکست خورده با استفاده از توکن جدید صادر شده
        return next(injectToken(req, newToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout(); // در صورتی که رفرش توکن هم اکسپایر شده باشد، کاربر کاملاً از سیستم خارج می‌شود
        return throwError(() => err);
      }),
    );
  }

  // ─── حالت دوم: یک درخواست موازی دیگر قبلاً پروسه رفرش را استارت زده و ما باید منتظر بمانیم ───
  else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null), // توقف در صف تا زمانی که توکن جدید در حالت اول صادر و غیر null شود
      take(1), // پس از یک بار دریافت داده، اشتراک صف را تمام کن
      // تکرار خودکار درخواست جاری به محض آزاد شدن صف با توکن جدید
      switchMap((token) => next(injectToken(req, token!))),
    );
  }
}
