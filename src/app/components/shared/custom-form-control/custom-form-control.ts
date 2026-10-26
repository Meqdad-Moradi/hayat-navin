import { Component, computed, effect, input, model, output, viewChild } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-form-control',
  styleUrl: './custom-form-control.css',
  templateUrl: './custom-form-control.html',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
})
export class CustomFormControl implements FormValueControl<string> {
  readonly value = model<string>('');

  // optional metadata inputs fed by [formField]
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly touched = input<boolean>(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touch = output<void>();

  // UI Customization Options
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'tel' | 'password'>('text');

  protected readonly showErrors = computed(() => this.touched() && this.errors().length > 0);

  private readonly matInput = viewChild(MatInput);

  constructor() {
    // MatInput has no NgControl here, so we drive its error state manually.
    effect(() => {
      const input = this.matInput();
      const invalid = this.showErrors();
      if (input && input.errorState !== invalid) {
        input.errorState = invalid;
        input.stateChanges.next(); // makes mat-form-field re-render (red outline + mat-error)
      }
    });
  }

  protected resetInput(): void {
    this.value.set('');
  }
}
