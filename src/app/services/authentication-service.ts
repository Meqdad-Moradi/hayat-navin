import { computed, inject, Service, signal } from '@angular/core';
import { User } from '../models/user-model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorResponse, ErrorsService } from './errors-service';
import { Observable, throwError } from 'rxjs';
import { SessionStorage } from '../helpers/session-storage';

@Service()
export class AuthenticationService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorsService);

  private readonly userUrl = 'users';
  private readonly storeKey = 'me';
  private readonly sessionStorage = new SessionStorage();
  private currentUserSignal = signal<User | null>(this.sessionStorage.get<User>(this.storeKey));

  public currentUser = this.currentUserSignal.asReadonly();

  public isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.initializeUserFromSession();
  }

  /**
   * login
   * @param email string
   * @param password string
   * @returns Observable<User | ErrorResponse<string>>
   */
  public login(email: string, password: string): Observable<User | ErrorResponse<string>> {
    return this.http.post<User>(this.userUrl, { email, password }).pipe(
      tap((user) => {
        this.sessionStorage.set(this.storeKey, user);
        this.currentUserSignal.set(user);
      }),
      catchError(this.errorService.handleError<string>('authentication-service::login')),
    );
  }

  /**
   * logout
   */
  public logout(): void {
    this.sessionStorage.remove(this.storeKey);
    this.currentUserSignal.set(null);
    //   localStorage.removeItem('access_token');
    //   localStorage.removeItem('refresh_token');
  }

  // ۱. متد ریفرش توکن که اینترسپتور آن را صدا می‌زند
  public refreshToken(): Observable<{ token: string }> {
    // ریفرش توکن بلندمدت را از حافظه برمی‌داریم
    const refreshToken = localStorage.getItem('refresh_token');

    // اگر ریفرش توکن هم وجود نداشته باشد، یعنی کلاً کاربر دسترسی ندارد
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // درخواست POST به بک‌اند برای دریافت اکسس توکن جدید
    // توجه: ما ریفرش توکن را در بدنه (Body) درخواست برای سرور می‌فرستیم
    return this.http
      .post<{ token: string }>('/api/auth/refresh', {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response) => {
          // به محض اینکه سرور اکسس توکن جدید را داد، آن را جایگزین توکن قدیمی در مرورگر می‌کنیم
          // localStorage.setItem(this.accessTokenKey, response.token);
          //   this.isAuthenticated.set(true);
        }),
      );
  }

  /**
   * initializeUserFromSession
   * Initializes the current user from session storage if available.
   * This method is called in the constructor to ensure that the user state is restored on page reloads.
   */
  private initializeUserFromSession(): void {
    const token = this.sessionStorage.get<User>(this.storeKey);
    if (token) {
      this.currentUserSignal.set(token);
    }
  }
}
