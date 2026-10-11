import { Component, input, output } from '@angular/core';
import { IUser } from '../../../../models/user-model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-item',
  styleUrl: './user-item.css',
  templateUrl: './user-item.html',
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
})
export class UserItem {
  readonly user = input.required<IUser>();

  readonly editUser = output<IUser>();

  protected onEditUser(): void {
    this.editUser.emit(this.user());
  }
}
