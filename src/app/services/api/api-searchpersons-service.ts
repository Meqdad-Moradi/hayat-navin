import { inject, Service } from '@angular/core';
import { ErrorResponse, ErrorsService } from '../errors-service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Person } from '../../models/persons-model';

@Service()
export class ApiSearchpersonsService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorsService);

  private readonly personsUrl = environment.apiUrls.personsUrl;

  /**
   * getPersons
   * @returns Observable<Person[] | ErrorResponse<string>>
   */
  public getPersons(): Observable<Person[] | ErrorResponse<string>> {
    return this.http.get<Person[]>(this.personsUrl).pipe(
      catchError(
        this.errorService.handleError<string>('api-persons-service::getPersons', {
          showErrorInDialog: true,
        }),
      ),
    );
  }
}
