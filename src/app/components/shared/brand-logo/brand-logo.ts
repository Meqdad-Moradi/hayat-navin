import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-logo',
  templateUrl: './brand-logo.html',
  imports: [MatIconModule, RouterLink],
})
export class BrandLogo {}
