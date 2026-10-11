import { Component, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.css',
  templateUrl: './confirm-dialog.html',
  imports: [MatDialogModule],
})
export class ConfirmDialog {
  readonly title = input('');
  readonly message = input('');
}
