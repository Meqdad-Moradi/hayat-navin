import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { initRegistrationModel } from '../../../models/registration-model';
import { CustomFormControl } from '../../shared/custom-form-control/custom-form-control';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
})
export class Register {
  private registrationModel = signal(initRegistrationModel());

  protected registrationForm = form(
    this.registrationModel,
    (path) => {
      required(path.studentName, { message: "Enter the student's full name." });
      required(path.email, { message: "Enter the student's email address." });
      email(path.email, { message: 'Enter a valid email address.' });
      required(path.phone, { message: 'Enter the student’s phone number.' });
      required(path.courseName, { message: 'Enter the course name.' });
    },
    {
      submission: {
        action: async (field) => {
          return undefined;
        },
      },
    },
  );

  /**
   * resetInput
   * @param fieldName string
   */
  protected resetInput(fieldName: string): void {
    this.registrationModel.update((fields) => ({ ...fields, [fieldName]: '' }));
  }
}
