import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-form-control',
  styleUrl: './custom-form-control.css',
  templateUrl: './custom-form-control.html',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormField],
})
export class CustomFormControl {
  readonly field = input.required<FieldTree<string>>();
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'tel' | 'password'>('text');
  readonly name = input.required<string>();

  /**
   * resetInput
   */
  protected resetInput(): void {
    this.field()().value.set(''); // remove the value
    this.field()().reset(); // keep the input as untouched
  }
}
