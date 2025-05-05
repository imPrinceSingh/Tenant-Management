import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { ThemeService } from '../../services/theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  sideNavService = inject(SidenavService)
  authService = inject(AuthService)
  configService = inject(ConfigService)
  themeService = inject(ThemeService)
  
  isAdmin = this.authService.isAdmin
  userInfo = this.authService.userInfo
  isSideNavOpen = this.sideNavService.isSideNavOpen
  features = this.configService.features
  tenantId = this.authService.tenantId


  get isDark(): boolean {
    return this.themeService.isDarkTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  closeSideNav() {
    this.sideNavService.toggleSideNav()
  }

  ngOnInit(): void {
    this.authService.startWatching();
  }
  
  constructor(private http: HttpClient) {
    effect(() => {
      const id = this.tenantId();
      if (id) {
        this.sideNavService.getEnabledFeature(id).subscribe({
          next: (data) => {
            const enabledFeature = this.features().filter(f => data[0][f.id] === true)
            this.features.set(enabledFeature)
          },
          error: (err) => {
            console.error('Failed to fetch features:', err);
          }
        });
      }
    }
    )
  }
}
