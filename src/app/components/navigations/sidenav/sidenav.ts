import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BrandLogo } from '../../shared/brand-logo/brand-logo';
import { SidenavService } from '../../../services/sidenav-service';

@Component({
  selector: 'app-sidenav',
  styleUrl: './sidenav.css',
  templateUrl: './sidenav.html',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatDivider,
    RouterOutlet,
    RouterLink,
    RouterOutlet,
    BrandLogo,
  ],
})
export class Sidenav {
  private sidenavService = inject(SidenavService);

  isSidenavOpen = this.sidenavService.isSidenavOpen;
}
