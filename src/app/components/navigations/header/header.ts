import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavService } from '../../../services/sidenav-service';
import { MatMenuModule } from '@angular/material/menu';
import { AuthenticationService } from '../../../services/authentication-service';

@Component({
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
})
export class Header {
  private sidenavService = inject(SidenavService);
  private authService = inject(AuthenticationService);

  /**
   * toggleSidenav
   */
  protected toggleSidenav(): void {
    this.sidenavService.isSidenavOpen.update((value) => !value);
  }

  protected logout(): void {
    this.authService.logout();
  }
}
