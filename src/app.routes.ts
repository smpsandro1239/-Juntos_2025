import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'activity/:id', loadComponent: () => import('./components/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent) },
  { path: 'event/:id', loadComponent: () => import('./components/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  { path: 'suppliers', loadComponent: () => import('./components/suppliers-page/suppliers-page.component').then(m => m.SuppliersPageComponent) },
  { path: 'supplier/:id', loadComponent: () => import('./components/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent) },
  { path: 'trip-planner', loadComponent: () => import('./components/trip-planner/trip-planner.component').then(m => m.TripPlannerComponent), canActivate: [authGuard] },
  { path: 'sos', loadComponent: () => import('./components/sos-page/sos-page.component').then(m => m.SosPageComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'premium', loadComponent: () => import('./components/premium/premium.component').then(m => m.PremiumComponent), canActivate: [authGuard] },
  { path: 'album/:id', loadComponent: () => import('./components/album-detail/album-detail.component').then(m => m.AlbumDetailComponent), canActivate: [authGuard] },
  { path: 'order-print/:albumId', loadComponent: () => import('./components/order-print/order-print.component').then(m => m.OrderPrintComponent), canActivate: [authGuard] },
  { path: 'order-success', loadComponent: () => import('./components/order-success/order-success.component').then(m => m.OrderSuccessComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
