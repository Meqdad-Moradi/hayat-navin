import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../../shared/brand-logo/brand-logo';

@Component({
  imports: [RouterLink, BrandLogo],
  selector: 'app-not-found',
  templateUrl: './not-found.html',
})
export class NotFound {}
