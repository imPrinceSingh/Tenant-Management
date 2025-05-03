import { Component, inject, OnInit, signal } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  sideNavService = inject(SidenavService)
  authService = inject(AuthService)
  isAdmin = this.authService.isAdmin
  userInfo = this.authService.userInfo
  isSideNavOpen = this.sideNavService.isSideNavOpen
  
  closeSideNav() {
    this.sideNavService.toggleSideNav()
  } 
  ngOnInit(): void {
    console.log(this.sideNavService.isSideNavOpen())
  }
}
