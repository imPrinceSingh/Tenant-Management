import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { interval, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  view: [number, number] = [700, 400];
  //----------here------------

  dashboardService = inject(AdminDashboardService)

  userCount = signal(0);
  activeUsers = signal(0)
  rolesCount = signal([])
  userRoleData = computed(() => {
    return Object.entries(this.rolesCount()).map(([role, count]) => ({
      name: role,
      value: count
    }));

  })
  recentActivities = signal<Array<any>>([])

  usersChartData = computed(() => {
    return [
      { name: 'Total Users', value: this.userCount() },
      { name: 'Active Users', value: this.activeUsers() }
    ]
  })
  loadUsers() {
    this.dashboardService.fetchUsersWithCount().subscribe({
      next: (data: any) => {
        this.userCount.set(data.count)
        const count = data.users.reduce((acc: Record<string, number>, user: any) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        this.rolesCount.set(count)
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }
  fetchActiveUsers() {
    this.dashboardService.activeUsers().subscribe({
      next: (users: any) => {
        this.activeUsers.set(users.count)
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }
  fetchRecentActivities() {
    this.dashboardService.recentActivity().subscribe({
      next: (data: any) => {
        this.recentActivities.set(data)
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }
  formatDateWithTime(isoDate: string): string {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    return date.toLocaleString('en-GB', options);
  }



  ngOnInit(): void {
    interval(5000).pipe(
      tap(() => {
        this.loadUsers()
        this.fetchActiveUsers()
        this.fetchRecentActivities()
      })
    ).subscribe();
    this.loadUsers()
    this.fetchActiveUsers()
    this.fetchRecentActivities()
  }

}
