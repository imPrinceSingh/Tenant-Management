import { Routes } from '@angular/router';
import { roleGuard } from './auth/guards/roles.guard';
import { authGuard } from './auth/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () => import('./tenant/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'admin-login',
        canActivate: [authGuard],
        loadComponent: () => import('./superadmin/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'admin-dashboard',
        canActivate: [roleGuard(['SuperAdmin'])],
        loadComponent: () => import('./superadmin/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'tenant',
        canActivate: [roleGuard(['SuperAdmin'])],
        loadComponent: () => import('./superadmin/components/tenant/tenant.component').then(m => m.TenantComponent)
    },
    {
        path: 'tenant-registration',
        canActivate: [roleGuard(['SuperAdmin'])],
        loadComponent: () => import('./superadmin/components/tenant-form/tenant-form.component').then(m => m.TenantFormComponent)
    },
    {
        path: 'dashboard',
        canActivate: [roleGuard(['Admin','Manager','Contributor'])],
        loadComponent: () => import('./tenant/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'user-management',
        canActivate: [roleGuard(['Admin','Manager','Contributor'])],
        loadComponent: () => import('./tenant/components/user-management/user-management.component').then(m => m.UserManagementComponent)
    },
    {
        path: 'billing',
        canActivate: [roleGuard(['Admin','Manager','Contributor'])],
        loadComponent: () => import('./tenant/components/billing/billing.component').then(m => m.BillingComponent)
    },
    {
        path: 'chat-support',
        canActivate: [roleGuard(['Admin','Manager','Contributor'])],
        loadComponent: () => import('./tenant/components/chat-support/chat-support.component').then(m => m.ChatSupportComponent)
    },
    {
        path: 'settings',
        canActivate: [roleGuard(['Admin','Manager','Contributor'])],
        loadComponent: () => import('./tenant/components/settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },
];

export { routes }
