import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { IUser } from '../../models/user-model';
import { ErrorResponse, ErrorsService } from '../errors-service';

@Service()
export class ApiUsersService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorsService);

  private readonly userUrl = 'https://jsonplaceholder.typicode.com';

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
}
