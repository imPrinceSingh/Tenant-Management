import { HttpClient } from '@angular/common/http';
import { computed, Injectable, NgZone, signal } from '@angular/core';
import { BehaviorSubject, catchError, fromEvent, map, merge, Observable, of, Subscription, switchMap, timer } from 'rxjs';

export interface User {
  id: string;
  token: string;
  role: string;
  tenantId?: string;
  email: string;
  password: string;
  name: string;
  active: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private idleTime = 10 * 60 * 1000; // 10 minutes
  private activityEvents$ = merge(
    fromEvent(document, 'mousemove'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'click'),
    fromEvent(document, 'scroll'),
    fromEvent(document, 'touchstart')
  );
  private idleSubscription: Subscription | null = null;

  constructor(private http: HttpClient,  private ngZone: NgZone) {}
  
    startWatching(): void {
      this.ngZone.runOutsideAngular(() => {
        this.idleSubscription = this.activityEvents$.pipe(
          switchMap(() => timer(this.idleTime))
        ).subscribe(() => {
          this.ngZone.run(() => {
            this.logout(this.userInfo());
          });
        });
      });
  }
  stopWatching(): void {
    this.idleSubscription?.unsubscribe();
  }
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:3000/';

  userInfo = signal<User | null>(this.getStoredUser());
  isLoggedIn = computed<boolean>(() => this.userInfo() !== null);
  isAdmin = computed<boolean>(() => this.userInfo()?.role === "SuperAdmin");
  tenantId = signal<string>(localStorage.getItem('tenantId') || '')

  private getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) as User : null;
    } catch (error) {
      console.error('Failed to parse user data', error);
      return null;
    }
  }
  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    return `${userAgent} (${screenWidth}x${screenHeight})`;
  }

 

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
    return this.http.get<any[]>(
      `${this.apiUrl}users?email=${email}&password=${password}`
    ).pipe(
      switchMap(users => {
        if (!users || users.length === 0) {
          console.warn('Login failed: No matching user found');
          return of(false);
        }

        const user = users[0];
        console.log('Logging in user:', user);

        // Basic validation
        if (!user.id) {
          console.error('User object missing id');
          return of(false);
        }

        //  user data
        const fakeToken = 'fake-jwt-token-' + user.id;
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role || 'user');

        if (user.tenantId) {
          this.tenantId.set(user.tenantId);
          localStorage.setItem('tenantId', user.tenantId.toString());
        }

        this.userInfo.set(user);
        this.userSubject.next(user);

        // activity data
        const loginActivity = {
          userId: user.id,
          email: user.email,
          tenantId: user.tenantId || null,
          loginTime: new Date().toISOString(),
          deviceInfo: this.getDeviceInfo(),
          status: 'success'
        };

        const activeUser = {
          id: user.id,
          userId: user.id,
          email: user.email,
          lastActive: new Date().toISOString(),
          sessionStart: new Date().toISOString(),
          status: 'active'
        };

        // First try to delete existing active user if exists
        return this.http.delete(`${this.apiUrl}activeUsers/${user.id}`).pipe(
          catchError(() => of(null)),
          switchMap(() => this.http.post(`${this.apiUrl}activityLogs`, loginActivity)),
          switchMap(() => this.http.post(`${this.apiUrl}activeUsers`, activeUser)),
          map(() => {
            return true;
          }),
          catchError(err => {
            console.error('Activity tracking failed:', err);
            return of(true); // Still return true for login
          })
        );
      }),
      catchError(err => {
        console.error('Login request failed:', err);
        return of(false);
      })
    );
  }




  logout(user: any): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}activeUsers/${user.id}`).pipe(
      switchMap(() => {
        const logoutActivity = {
          userId: user.id,
          logoutTime: new Date().toISOString(),
          email: user.email,
          tenantId: this.tenantId(),
          status: 'inactive'
        };
        return this.http.post(`${this.apiUrl}activityLogs`, logoutActivity);
      }),
      map(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('user-theme')
        this.userSubject.next(null);

        return true;
      }),
      catchError(error => {
        console.error('Logout error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('user-theme')

        this.userSubject.next(null);

        return of(true);
      })
    );
  }
}
