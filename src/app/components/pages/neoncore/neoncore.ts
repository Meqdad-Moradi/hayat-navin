import { Component, computed, signal } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';
import {
  email,
  form,
  FormField,
  maxLength,
  pattern,
  validate,
  FormRoot,
} from '@angular/forms/signals';
import { CustomFormControl } from '../../shared/custom-form-control/custom-form-control';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import {
  minLengthValidation,
  requiredValidation,
  INeoncorn,
  PASSWORD_RULES,
  patternValidation,
} from '../../../models/neoncorn';

@Component({
  selector: 'app-neoncore',
  styleUrl: './neoncore.css',
  templateUrl: './neoncore.html',
  imports: [
    PageHeader,
    CustomFormControl,
    FormField,
    NgClass,
    MatCheckboxModule,
    MatButtonModule,
    FormRoot,
  ],
})
export class Neoncore {
  private neoncoreModel = signal<INeoncorn>({
    callsign: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerm: false,
  });

  protected neoncornForm = form(
    this.neoncoreModel,
    (schemaPath) => {
      const keys = Object.keys(this.neoncoreModel()) as (keyof INeoncorn)[];
      requiredValidation(schemaPath, keys);
      maxLength(schemaPath.callsign, 20, { message: 'Max. 20 Characters!' });
      minLengthValidation(schemaPath.callsign, 3);
      minLengthValidation(schemaPath.password, 8);
      email(schemaPath.email, { message: 'Invalid Email!' });
      patternValidation(
        schemaPath.callsign,
        /^[A-Za-z0-9_-]+$/,
        '3 - 20 Characters: letters, numbers and _ or -',
      );

      PASSWORD_RULES.forEach(({ regex, message }) =>
        patternValidation(schemaPath.password, regex, message),
      );

      validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
        const val = value();
        const passwordValue = valueOf(schemaPath.password);
        if (val !== passwordValue) {
          return {
            kind: 'confirmPasswordInvalid',
            message: 'Password does not match!',
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          console.log(value);
          return undefined;
        },
        onInvalid: (field) => {
          const firstError = field().errorSummary()[0];
          firstError?.fieldTree().focusBoundControl();
        },
        ignoreValidators: 'none',
      },
    },
  );

  protected passwordRules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    valid: computed(() => rule.regex.test(this.neoncoreModel().password)),
  }));
}
