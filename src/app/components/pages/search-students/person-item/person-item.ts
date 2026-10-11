import { Component, input } from '@angular/core';
import { Person } from '../../../../models/persons-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-person-item',
  styleUrl: './person-item.css',
  templateUrl: './person-item.html',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
})
export class PersonItem {
  readonly person = input.required<Person>();
}
