import { Component, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication-service';
import { initLoginModel } from '../../../models/login-model';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ErrorResponse } from '../../../services/errors-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrandLogo } from '../../shared/brand-logo/brand-logo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  host: {
    class: 'block min-h-screen',
  },
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormField,
    FormRoot,
    BrandLogo,
  ],
})
export class Login {
  private authService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private loginModel = signal(initLoginModel());

  protected hasAttemptedSubmit = signal(false);

  protected loginForm = form(
    this.loginModel,
    (path) => {
      required(path.email, { message: "Can't be empty!" });
      required(path.password, { message: "Can't be empty!" });
      email(path.email, { message: 'Invalid email format!' });
    },
    {
      submission: {
        action: async (field) => {
          const { email, password } = field().value();
          const result = await firstValueFrom(this.authService.login(email, password));

          if (result instanceof ErrorResponse) {
            return { kind: result.status?.toString(), message: result.value?.toString() };
          }
          const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? '/';
          this.router.navigateByUrl(returnUrl);
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
    this.loginModel.update((model) => ({ ...model, [fieldName]: '' }));
  }

  protected onSubmit(): void {
    this.hasAttemptedSubmit.set(true);
  }
}
