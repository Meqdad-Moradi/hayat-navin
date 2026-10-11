import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ApiSearchpersonsService } from '../../../services/api/api-searchpersons-service';
import { Person } from '../../../models/persons-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorResponse } from '../../../services/errors-service';
import { PageHeader } from '../../shared/page-header/page-header';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PersonItem } from './person-item/person-item';

@Component({
  selector: 'app-search-students',
  styleUrl: './search-students.css',
  templateUrl: './search-students.html',
  imports: [PageHeader, MatProgressSpinner, PersonItem],
})
export class SearchStudents implements OnInit {
  private readonly apiPersonsService = inject(ApiSearchpersonsService);
  private readonly destroyRef = inject(DestroyRef);

  protected persons = signal<Person[]>([]);
  protected isLoading = signal(true);

  ngOnInit(): void {
    this.getStudents();
  }

  /**
   * getStudents
   */
  private getStudents(): void {
    this.apiPersonsService
      .getPersons()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isLoading.set(false);

        if (res instanceof ErrorResponse) {
          return;
        }

        this.persons.set(res);
      });
  }
}
