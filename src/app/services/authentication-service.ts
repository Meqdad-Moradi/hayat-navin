import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorResponse, ErrorsService } from './errors-service';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

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
  private router = inject(Router);

  // آدرس‌های پایه مربوط به بخش بک‌اند
  private readonly API_URL = environment.apiUrls.authUrl;

  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly userKey = 'user_email';

  /**
   * @private setTokens
   * @description ذخیره امن توکن‌ها در ستورج پیش‌فرض مرورگر به صورت رشته متنی ساده.
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.accessTokenKey, accessToken);
    sessionStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  /**
   * @public getAccessToken
   * @description دریافت آخرین اکسس توکن فعال از حافظه مرورگر.
   */
  public getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  /**
   * @public getRefreshToken
   * @description دریافت رفرش توکن فعال جهت استفاده در مواقع انقضا.
   */
  public getRefreshToken(): string | null {
    return sessionStorage.getItem(this.refreshTokenKey);
  }

  /**
   * getCurrentUserEmail
   * @returns string | null - email
   */
  public getCurrentUserEmail(): string | null {
    const storedEmail = sessionStorage.getItem(this.userKey);
    if (storedEmail) {
      return storedEmail;
    }

    const accessToken = this.getAccessToken();
    const payload = accessToken?.split('.')[1];
    if (!payload) {
      return null;
    }

    try {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(
        normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='),
      );
      const claims: unknown = JSON.parse(decodedPayload);

      if (
        typeof claims === 'object' &&
        claims !== null &&
        'email' in claims &&
        typeof claims.email === 'string'
      ) {
        this.updateCurrentUserEmail(claims.email);
        return claims.email;
      }
    } catch (error: unknown) {
      console.warn('Unable to restore the profile email from the access token.', error);
    }

    return null;
  }

  /**
   * updateCurrentUserEmail
   * @param email string
   */
  public updateCurrentUserEmail(email: string): void {
    sessionStorage.setItem(this.userKey, email);
  }

  /**
   * @public updateAccessToken
   * @description به روزرسانی رشته اکسس توکن پس از عملیات رفرش توکن موفق.
   */
  public updateAccessToken(token: string): void {
    sessionStorage.setItem(this.accessTokenKey, token);
  }

  /**
   * login
   * @param email string
   * @param password string
   * @returns Observable<User | ErrorResponse<string>>
   * @description ارسال اطلاعات ورود به سرور و راه‌اندازی سشن‌های کاربری در صورت تایید.
   */
  public login(email: string, password: string): Observable<LoginResponse | ErrorResponse<string>> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((res) => {
        // مرحله ۱: ذخیره کردن کلیدهای دیجیتالی (توکن‌ها) در مرورگر
        this.setTokens(res.accessToken, res.refreshToken);
        this.updateCurrentUserEmail(email);
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
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.userKey);
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
      .pipe(tap((response) => this.updateAccessToken(response.accessToken)));
  }

  /**
   * isLoggedIn
   * @returns boolean
   */
  public isLoggedIn(): boolean {
    return (
      !!sessionStorage.getItem(this.accessTokenKey) &&
      !!sessionStorage.getItem(this.refreshTokenKey)
    );
  }
}
