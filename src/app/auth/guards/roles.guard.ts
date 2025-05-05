// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.userInfo()

    if (user && requiredRoles.includes(user.role)) {
      return true;
    }

    router.navigate(['/unauthorized']); // redirect if not allowed
    return false;
  };
};
