import { Routes } from '@angular/router';
// import { SuperadminGuard } from './shared/guards/superadmin.gaurd';
// import { TenantUserGuard } from './shared/guards/tenant-user.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./tenant/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'admin-login',
        loadComponent: () => import('./superadmin/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'admin-dashboard',
        loadComponent: () => import('./superadmin/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'tenant',
        loadComponent: () => import('./superadmin/components/tenant/tenant.component').then(m => m.TenantComponent)
    },
    {
        path: 'tenant-registration',
        loadComponent: () => import('./superadmin/components/tenant-form/tenant-form.component').then(m => m.TenantFormComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./tenant/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'user-management',
        loadComponent: () => import('./tenant/components/user-management/user-management.component').then(m => m.UserManagementComponent)
    },
    {
        path: 'billing',
        loadComponent: () => import('./tenant/components/billing/billing.component').then(m => m.BillingComponent)
    },
    {
        path: 'chat-support',
        loadComponent: () => import('./tenant/components/chat-support/chat-support.component').then(m => m.ChatSupportComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./tenant/components/settings/settings.component').then(m => m.SettingsComponent)
    },
    // {
    //   path: 'superadmin',
    //   canActivate: [SuperadminGuard],
    //   loadChildren: () =>
    //     import('./superadmin/superadmin.module').then(m => m.SuperadminModule)
    // },
    // {
    //   path: 'admin',
    //   canActivate: [TenantUserGuard],
    //   loadChildren: () =>
    //     import('./modules/tenant/tenant.module').then(m => m.TenantModule)
    // },
    // { path: 'unauthorized', component: UnauthorizedComponent }
];

export { routes }
