import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

export const loginCanMatchGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  return authService.isLoggedIn() ? true : router.navigateByUrl('/auth');
};
