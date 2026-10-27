import {
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  output,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

type TInputType = 'text' | 'email' | 'tel' | 'password';

@Component({
  selector: 'app-custom-form-control',
  styleUrl: './custom-form-control.css',
  templateUrl: './custom-form-control.html',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule],
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
  readonly inputType = model<TInputType>('text');

  protected readonly showErrors = computed(() => this.touched() && this.errors().length > 0);

  private readonly matInput = viewChild(MatInput);

  protected currentType = linkedSignal({
    source: () => this.inputType(),
    computation: (source: TInputType) => {
      return source;
    },
  });

  protected passwordVisibilityIcon = computed(() =>
    this.currentType() === 'password' ? 'visibility_off' : 'visibility',
  );

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

  public focus(): void {
    this.matInput()?.focus();
  }

  protected togglePasswordType(): void {
    if (this.currentType() === 'password') {
      this.currentType.set('text');
    } else {
      if (this.inputType() === 'password') {
        this.currentType.set('password');
      } else {
        this.currentType.set(this.inputType());
      }
    }
  }
}
