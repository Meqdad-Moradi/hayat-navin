import { Component, DestroyRef, inject, inputBinding, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IUser } from '../../../models/user-model';
import { ApiUsersService } from '../../../services/api/api-users-service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ErrorResponse } from '../../../services/errors-service';
import { PageHeader } from '../../shared/page-header/page-header';
import { environment } from '../../../environments/environment';
import { UserItem } from './user-item/user-item';
import { MatDialog } from '@angular/material/dialog';
import { Register } from '../register/register';

@Component({
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
  imports: [
    PageHeader,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    UserItem,
  ],
})
export class Users implements OnInit {
  private readonly apiUsersService = inject(ApiUsersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected isLoading = signal(true);
  protected users = signal<IUser[]>([]);

  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * getUsers
   * get users from jsonplaceholder
   */
  private getUsers(): void {
    this.apiUsersService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isLoading.set(false);
        if (res instanceof ErrorResponse) {
          return;
        }
        this.users.set(res);
      });
  }

  /**
   * editUser
   * @param user IUser
   */
  protected editUser(user: IUser): void {
    this.dialog.open(Register, {
      minWidth: 600,
      bindings: [inputBinding('user', signal(user))],
    });
    // this.router.navigate(['/', environment.apps.registration.route], {
    //   queryParams: { userId: user.id },
    //   state: { user },
    // });
  }
}
