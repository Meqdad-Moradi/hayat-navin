import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { BrandLogo } from '../../shared/brand-logo/brand-logo';
import { SidenavService } from '../../../services/sidenav-service';
import { environment } from '../../../environments/environment';

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
    RouterLinkActive
],
})
export class Sidenav {
  private sidenavService = inject(SidenavService);

  protected isSidenavOpen = this.sidenavService.isSidenavOpen;
  protected appRoutes = environment.apps;
}
