import { CanActivateFn } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const requiredRoles = route.data['roles'] as Array<string>;

  // اگر نقشی تعریف نشده بود، اجازه عبور بده
  if (!requiredRoles || !requiredRoles.length) {
    return true;
  }

  // // بررسی اینکه آیا کاربر حداقل یکی از نقش‌های مورد نیاز را دارد؟
  // const hasPermission = requiredRoles.some((role) => authService.hasRole(role));

  // if (hasPermission) {
  //   return true;
  // }

  return false;
};
