import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface User {
  token: string;
  role: string;
  tenantId?: string;
  email: string;
  password: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:3000/';

  userInfo = signal<User | null>(this.getStoredUser());
  isLoggedIn = computed<boolean>(() => this.userInfo() !== null);
  isAdmin = computed<boolean>(() => this.userInfo()?.role === "SuperAdmin");
  tenantId = signal<string>(localStorage.getItem('tenantId')||'')

  private getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) as User : null;
    } catch (error) {
      console.error('Failed to parse user data', error);
      return null;
    }
  }
  
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}auth?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          // Simulate token
          const fakeToken = 'fake-jwt-token-' + user.id;
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role || 'user');
          if (user.tenantId) {
            localStorage.setItem('tenantId', user.tenantId);
          }
          this.userInfo.set(user)  
          this.userSubject.next(user);

          return true;
        }
        return false;
      })
    );
  }

  tenantLogin(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          const fakeToken = 'fake-jwt-token-' + user.id;
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role || 'user');
          if (user.tenantId) {
            this.tenantId.set(user.tenantId)
            localStorage.setItem('tenantId', user.tenantId);
          }
          this.userInfo.set(user)  
          this.userSubject.next(user);

          return true;
        }
        return false;
      })
    );
  }


  getRole(): string {
    return localStorage.getItem('role') || '';
  }


  getTenantId() {
    return localStorage.getItem('tenantId');
  }

  logout() {
    localStorage.clear();
    this.userSubject.next(null);
  }
}
