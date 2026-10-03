import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  return authService.isLoggedIn()
    ? true
    : router.createUrlTree(['/', 'login'], { queryParams: { returnUrl: state.url } });
};
