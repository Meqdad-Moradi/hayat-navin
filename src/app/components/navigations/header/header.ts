import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavService } from '../../../services/sidenav-service';
import { MatMenuModule } from '@angular/material/menu';
import { AuthenticationService } from '../../../services/authentication-service';
import { ThemeService } from '../../../services/theme-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
})
export class Header {
  private sidenavService = inject(SidenavService);
  private authService = inject(AuthenticationService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  protected isDark = this.themeService.isDark;

  /**
   * toggleSidenav
   */
  protected toggleSidenav(): void {
    this.sidenavService.isSidenavOpen.update((value) => !value);
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/', 'login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
