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

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const token = authService.currentUser()?.accessToken; // access_token from the current user

  let authReq = req;

  if (token) {
    authReq = injectToken(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      // اگر خطا از نوع HTTP بود و کد آن 401 بود، یعنی توکن باطل شده!
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // حالا باید فرآیند پیچیده تمدید توکن (Refresh) را شروع کنیم
        return handle401Error(authReq, next, authService);
      }
      // اگر خطای دیگری بود (مثل 500 یا 404)، کاری به آن نداریم و پاس می‌دهیم برود
      return throwError(() => error);
    }),
  );
};

/**
 * injectToken
 * Injects the authentication token into the HTTP request.
 * @param req HttpRequest<any> - The original HTTP request.
 * @param token string - The authentication token.
 * @returns HttpRequest<any> - The modified HTTP request with the authentication header.
 */
function injectToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

/**
 * handle401Error
 * Handles 401 Unauthorized errors by attempting to refresh the token.
 * If a refresh is already in progress, it waits for the new token before retrying the request.
 * @param req HttpRequest<any> - The original HTTP request that resulted in a 401 error.
 * @param next HttpHandlerFn - The next handler in the HTTP request chain.
 * @param authService AuthenticationService - The authentication service used to refresh the token.
 * @returns Observable<any> - An observable that either retries the original request with a new token or throws an error.
 */
function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthenticationService,
): Observable<any> {
  // حالت الف: ما اولین درخواستی هستیم که به خطای 401 خورده است!
  if (!isRefreshing) {
    // اینترسپتور وضعیت isRefreshing را فعال می‌کند و درخواست "لیست محصولات" را موقتاً نگه می‌دارد.
    isRefreshing = true; // کلید را روشن می‌کنیم تا بقیه درخواست‌ها بفهمند ما دست‌به‌کار شدیم
    refreshTokenSubject.next(null); // سالن انتظار را خالی می‌کنیم

    // به سرور می‌گوییم: لطفاً با استفاده از Refresh Token، یک Access Token جدید به من بده
    return authService.refreshToken().pipe(
      switchMap((res: any) => {
        isRefreshing = false; // کارمان تمام شد، کلید را خاموش می‌کنیم
        localStorage.setItem('access_token', res.token);
        refreshTokenSubject.next(res.token); // توکن جدید را به تمام درخواست‌های منتظر در سالن اعلام می‌کنیم

        // درخواست اولیه‌ای که به خطا خورده بود را دوباره با توکن جدید می‌فرستیم!
        return next(injectToken(req, res.token));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout(); // اگر ریفرش توکن هم منقضی شده بود، کاربر لوگ‌اوت می‌شود
        return throwError(() => err);
      }),
    );
  }
  // حالت ب: یک درخواست دیگر قبلاً پروسه ریفرش را شروع کرده و ما باید در صف منتظر بمانیم!
  else {
    // اگر یک فرآیند ریفرش در جریان است، بقیه درخواست‌ها منتظر می‌مانند تا توکن جدید صادر شود
    return refreshTokenSubject.pipe(
      filter((token) => token !== null), // منتظر می‌ماند تا بالاخره توکن جدید صادر و تزریق شود
      take(1),
      // به محض اینکه توکن جدید آمد، درخواست جاری را با توکن جدید کلون کرده و می‌فرستد
      switchMap((token) => next(injectToken(req, token!))),
    );
  }
}
