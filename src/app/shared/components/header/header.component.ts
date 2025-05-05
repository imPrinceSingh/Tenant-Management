import { NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgStyle]
})
export class HeaderComponent {
  sideNavService = inject(SidenavService)
  authService = inject(AuthService)
  isSideNavOpen = this.sideNavService.isSideNavOpen()
  tenantInfo = this.sideNavService.tenantInfo
  userInfo = this.authService.userInfo;
  isLoggedIn = this.authService.isLoggedIn;
  tenantId = this.authService.tenantId

  constructor(private router: Router, private toastr : ToastrService) {}

  logout(): void {
    this.authService.logout(this.userInfo()).subscribe({
      next: (success) => {
        this.toastr.success('Logout successfully!', 'Success')
        this.router.navigate(['/']);  
        this.sideNavService.isSideNavOpen.set(false)
        this.userInfo.set(null)
        this.tenantInfo.set(null)
        this.tenantId.set('')       
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.toastr.error('Failed to logout!', 'Error')
        this.router.navigate(['/login']);
        
      }
    });
   
  }
  toggleSideNav(): void{
    this.sideNavService.toggleSideNav()
  }
}
