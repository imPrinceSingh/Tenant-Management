import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class TenantUserGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.auth.getRole();
    if (['Admin', 'Manager', 'Contributor'].includes(role)) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
