import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // if (authService.isAuthenticated()) {
  //   // بررسی نقش کاربر (Role-based Authentication) به صورت سینیور لول
  //   const expectedRoles = route.data['roles'] as string[];
  //   const userRoles = authService.currentUser()?.roles || [];

  //   if (expectedRoles && !expectedRoles.some((role) => userRoles.includes(role))) {
  //     // کاربر احراز هویت شده اما دسترسی به این نقش ندارد
  //     return router.createUrlTree(['/unauthorized']);
  //   }

  //   return true; // دسترسی مجاز است
  // }

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree(['/', 'login'], {
        queryParams: { returnUrl: state.url },
      });
};
