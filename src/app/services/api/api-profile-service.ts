import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../models/user-model';
import { ErrorResponse, ErrorsService } from '../errors-service';

@Service()
export class ApiProfileService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorsService);
  private readonly usersUrl = environment.apiUrls.usersUrl;

  /**
   * getUserByEmail
   * Finds the account associated with the signed-in user's email address.
   */
  public getUserByEmail(email: string): Observable<User | null | ErrorResponse<string>> {
    // Filter on the server so the profile lookup returns only the signed-in user's account.
    const params = new HttpParams().set('email', email);

    return this.http.get<User[]>(this.usersUrl, { params }).pipe(
      map((users) => users[0] ?? null),
      catchError(
        this.errorService.handleError<string>('profile-service::getUserByEmail', {
          showErrorInDialog: true,
        }),
      ),
    );
  }

  /**
   * updateUser
   * Updates editable profile details without sending the user's password or roles.
   */
  public updateUser(
    id: string,
    profile: Pick<User, 'firstName' | 'lastName' | 'username' | 'email'>,
  ): Observable<User | ErrorResponse<string>> {
    return this.http.patch<User>(`${this.usersUrl}/${encodeURIComponent(id)}`, profile).pipe(
      catchError(
        this.errorService.handleError<string>('profile-service::getUserByEmail', {
          showErrorInDialog: true,
        }),
      ),
    );
  }
}
