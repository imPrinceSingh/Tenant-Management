import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service'; 

@Injectable({ providedIn: 'root' })
export class SuperadminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.getRole() === 'Superadmin') return true;
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
