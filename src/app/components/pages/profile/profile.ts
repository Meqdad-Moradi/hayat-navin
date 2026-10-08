import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { email, form, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../models/user-model';
import { AuthenticationService } from '../../../services/authentication-service';
import { ErrorResponse, ErrorsService } from '../../../services/errors-service';
import { ApiProfileService } from '../../../services/api/api-profile-service';
import { CustomFormControl } from '../../shared/custom-form-control/custom-form-control';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

type EditableProfile = Pick<User, 'firstName' | 'lastName' | 'username' | 'email'>;

@Component({
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
  imports: [FormRoot, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CustomFormControl],
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthenticationService);
  private readonly errorsService = inject(ErrorsService);
  private readonly profileService = inject(ApiProfileService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly profileModel = signal<EditableProfile>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });
  protected readonly user = signal<User | null>(null);
  protected readonly isLoading = signal(true);

  protected readonly profileForm = form(
    this.profileModel,
    (path) => {
      required(path.firstName, { message: 'Enter your first name.' });
      required(path.lastName, { message: 'Enter your last name.' });
      required(path.username, { message: 'Enter your username.' });
      required(path.email, { message: 'Enter your email address.' });
      email(path.email, { message: 'Enter a valid email address.' });
    },
    {
      submission: {
        action: async (field) => {
          const user = this.user();

          if (!user) {
            // if user does not exist, return error and don't update anything
            return { kind: 'profile-unavailable', message: 'Your profile could not be loaded.' };
          }

          try {
            const updatedUser = await firstValueFrom(
              this.profileService.updateUser(user.id, field().value()),
            );

            if (updatedUser instanceof ErrorResponse) {
              return { kind: updatedUser.status?.toString(), message: updatedUser?.value };
            } else {
              this.user.set(updatedUser);
              this.authService.updateCurrentUserEmail(updatedUser.email);
              // display toaster
              this.snackbar.open('User updated successfully!', 'OK', { duration: 500 });
            }
            return undefined;
          } catch (error: unknown) {
            const message = this.errorsService.getErrorMessage(error, 'profile-service::update');
            return { kind: 'profile-update-failed', message };
          }
        },
      },
    },
  );

  public ngOnInit(): void {
    void this.loadProfile();
  }

  /**
   * loadProfile
   * @returns void
   */
  private loadProfile(): void {
    const email = this.authService.getCurrentUserEmail();
    if (!email) {
      this.isLoading.set(false);
      return;
    }

    this.profileService
      .getUserByEmail(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isLoading.set(false);

        if (res instanceof ErrorResponse) return;

        this.user.set(res);

        this.profileModel.set({
          firstName: res?.firstName ?? '',
          lastName: res?.lastName ?? '',
          username: res?.username ?? '',
          email: res?.email ?? '',
        });
      });
  }
}
