import { NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgStyle]
})
export class HeaderComponent implements OnInit {
  sideNavService = inject(SidenavService)
  authService = inject(AuthService)
  isSideNavOpen = this.sideNavService.isSideNavOpen()
  tanentInfo = this.sideNavService.tanentInfo
  userInfo = this.authService.userInfo;
  isLoggedIn = this.authService.isLoggedIn;
  tenantId = this.authService.tenantId
  constructor(private router: Router) {}
  
  ngOnInit(): void {
  
    // console.log(this.authService.admin)
    // const token = localStorage.getItem('token');
    // this.email = localStorage.getItem('email') || '';
    // this.role = localStorage.getItem('role') || '';
    // this.isLoggedIn = !!token;
  }

  logout(): void {
    localStorage.clear();
    this.sideNavService.isSideNavOpen.set(false)
    this.userInfo.set(null)
    this.router.navigate(['/']);
  }
  toggleSideNav(): void{
    this.sideNavService.toggleSideNav()
  }
}
