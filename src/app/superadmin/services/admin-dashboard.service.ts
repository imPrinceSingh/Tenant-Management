import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService, User } from '../../auth/services/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  authService = inject(AuthService)
  tenantId = this.authService.tenantId

  fetchUsersWithCount(): Observable<{users: User[], count: number}> {
    return this.http.get<User[]>('http://localhost:3000/users').pipe(
      map(users => ({
        users: users,
        count: users.length
      }))
    );
  }
  activeUsers(): Observable<{users: User[], count: number}> {
    return this.http.get<User[]>('http://localhost:3000/activeUsers').pipe(
      map(users => ({
        users: users,
        count: users.length
      }))
    );
  }
  recentActivity() {
    return this.http.get('http://localhost:3000/activityLogs')
  }
  
  constructor(private http:HttpClient) { }
}
