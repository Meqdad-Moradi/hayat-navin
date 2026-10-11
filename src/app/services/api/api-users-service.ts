import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { IUser } from '../../models/user-model';
import { ErrorResponse, ErrorsService } from '../errors-service';

@Service()
export class ApiUsersService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorsService);

  private readonly userUrl = 'https://jsonplaceholder.typicode.com/users';

  /**
   * getUsers
   * @returns Observable<IUser[] | ErrorResponse<string>>
   */
  public getUsers(): Observable<IUser[] | ErrorResponse<string>> {
    return this.http.get<IUser[]>(this.userUrl).pipe(
      catchError(
        this.errorService.handleError<string>('api-users-service::getUsers', {
          showErrorInDialog: true,
        }),
      ),
    );
  }

  public getUser(id: number): Observable<IUser | ErrorResponse<string>> {
    return this.http.get<IUser>(`${this.userUrl}/${id}`).pipe(
      catchError(
        this.errorService.handleError<string>('api-users-service::getUser', {
          showErrorInDialog: true,
        }),
      ),
    );
  }

  public updateUser(user: IUser): Observable<IUser | ErrorResponse<string>> {
    return this.http.put<IUser>(`${this.userUrl}/${user.id}`, user).pipe(
      catchError(
        this.errorService.handleError<string>('api-users-service::updateUser', {
          showErrorInDialog: true,
        }),
      ),
    );
  }
}
