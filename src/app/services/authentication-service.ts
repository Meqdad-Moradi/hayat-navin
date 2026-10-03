import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user-model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorResponse, ErrorsService } from './errors-service';
import { Observable, throwError } from 'rxjs';
import { SessionStorage } from '../helpers/session-storage';
import { environment } from '../environments/environment';

/**
 * @class AuthenticationService
 * @description مدیریت کامل فرآیند ورود، خروج، وضعیت کاربر و تمدید داینامیک توکن‌ها.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorsService);

  // آدرس‌های پایه مربوط به بخش بک‌اند
  private readonly API_URL = environment.apiUrls.authUrl;
  private readonly storeKey = 'me';
  private readonly sessionStorageWrapper = new SessionStorage();

  // مدیریت وضعیت کاربر فعلی با استفاده از انگولار سیگنالز (Angular Signals)
  private currentUserSignal = signal<User | null>(
    this.sessionStorageWrapper.get<User>(this.storeKey),
  );

  // تعریف متغیر عمومی وضعیت به صورت Readonly برای استفاده امن در کامپوننت‌ها
  public currentUser = this.currentUserSignal.asReadonly();

  // وضعیت احراز هویت (آیا کاربر وارد شده است یا خیر؟)
  public isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.initializeUserFromSession();
  }

  /**
   * @private setTokens
   * @description ذخیره امن توکن‌ها در ستورج پیش‌فرض مرورگر به صورت رشته متنی ساده.
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * @public getAccessToken
   * @description دریافت آخرین اکسس توکن فعال از حافظه مرورگر.
   */
  public getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  /**
   * @public getRefreshToken
   * @description دریافت رفرش توکن فعال جهت استفاده در مواقع انقضا.
   */
  public getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  }

  /**
   * @public updateAccessToken
   * @description به روزرسانی رشته اکسس توکن پس از عملیات رفرش توکن موفق.
   */
  public updateAccessToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  /**
   * login
   * @param email string
   * @param password string
   * @returns Observable<User | ErrorResponse<string>>
   * @description ارسال اطلاعات ورود به سرور و راه‌اندازی سشن‌های کاربری در صورت تایید.
   */
  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/auth/login', { email, password }).pipe(
      tap((res) => {
        // مرحله ۱: ذخیره کردن کلیدهای دیجیتالی (توکن‌ها) در مرورگر
        this.setTokens(res.accessToken, res.refreshToken);

        // مرحله ۲: تشکیل شیء کاربر بر اساس مدل استاندارد پروژه
        const userObj: User = {
          email: email,
          // سایر مشخصات کاربر مثل نام و نقش‌ها را می‌توانید اینجا بسازید
        } as User;

        // مرحله ۳: به‌روزرسانی سیستم مدیریت وضعیت فرانت‌اند
        this.sessionStorageWrapper.set(this.storeKey, userObj);
        this.currentUserSignal.set(userObj);
      }),
      // مدیریت خطاها در صورت ورود اطلاعات نامعتبر
      catchError(this.errorService.handleError<string>('authentication-service::login')),
    );
  }

  /**
   * logout
   * @description پاکسازی تمامی حافظه‌های محلی مرورگر و تغییر وضعیت کاربر به حالت مهمان.
   */
  public logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    this.sessionStorageWrapper.remove(this.storeKey);
    this.currentUserSignal.set(null);
  }

  /**
   * refreshToken
   * @description تمدید اکسس توکن منقضی شده با استفاده از رفرش توکن ذخیره شده.
   * @returns Observable<{ accessToken: string }>
   */
  public refreshToken(): Observable<{ accessToken: string }> {
    // مرحله ۱: بازیابی رفرش توکن بلندمدت از حافظه
    const refreshToken = this.getRefreshToken();

    // مرحله ۲: اگر کاربر فاقد رفرش توکن بود، دسترسی فوراً متوقف می‌شود
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // مرحله ۳: درخواست ارسال رفرش توکن در بدنه POST به سرور جهت دریافت توکن جدید
    return this.http
      .post<{ accessToken: string }>(this.API_URL + '/refresh-token', {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          const newToken = response.accessToken;

          // مرحله ۴: ذخیره اکسس توکن جدید به دست آمده در مرورگر
          this.updateAccessToken(newToken);

          // مرحله ۵: اعمال تغییرات جدید روی سیگنال‌های فعال اپلیکیشن
          if (this.currentUserSignal()) {
            const currentUser = { ...this.currentUserSignal() } as User;
            this.sessionStorageWrapper.set(this.storeKey, currentUser);
            this.currentUserSignal.set(currentUser);
          }
        }),
      );
  }

  /**
   * initializeUserFromSession
   * @private
   * @description بازیابی وضعیت کاربر از سشن استورج در زمان رفرش کل صفحه مرورگر (F5) جهت جلوگیری از پریدن لاگین.
   */
  private initializeUserFromSession(): void {
    const token = this.sessionStorageWrapper.get<User>(this.storeKey);
    if (token) {
      this.currentUserSignal.set(token);
    }
  }
}
