import { Component, computed, effect, input, signal } from '@angular/core';
import { disabled, email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { initRegistrationModel } from '../../../models/registration-model';
import { CustomFormControl } from '../../shared/custom-form-control/custom-form-control';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeader } from '../../shared/page-header/page-header';
import { IUser } from '../../../models/user-model';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
  imports: [
    FormRoot,
    CustomFormControl,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PageHeader,
    FormField,
  ],
})
export class Register {
  readonly user = input<IUser | null>(null);

  protected isUpdating = computed(() => !!this.user());

  private registrationModel = signal(initRegistrationModel());

  protected registrationForm = form(
    this.registrationModel,
    (path) => {
      required(path.studentName, { message: "Enter the student's full name." });
      required(path.email, { message: "Enter the student's email address." });
      email(path.email, { message: 'Enter a valid email address.' });
      required(path.phone, { message: 'Enter the student’s phone number.' });
      required(path.courseName, {
        when: () => !this.isUpdating(),
        message: 'Enter the course name.',
      });
    },
    {
      submission: {
        action: async (field) => {
          return undefined;
        },
      },
    },
  );

  constructor() {
    effect(() => {
      if (this.isUpdating()) {
        // update registration model with the user that getting from users page
        this.registrationModel.update((val) => {
          const user = { ...val };
          user.studentName = this.user()?.name || '';
          user.phone = this.user()?.phone || '';
          user.email = this.user()?.email || '';
          return user;
        });
      }
    });
  }
}
