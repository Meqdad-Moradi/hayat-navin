import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.css',
  templateUrl: './confirm-dialog.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialog {
  readonly title = input('');
  readonly message = input('');
}
