import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'activity/:id',
    loadComponent: () => import('./components/activity-detail/activity-detail.component').then(c => c.ActivityDetailComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'trip-planner',
    loadComponent: () => import('./components/trip-planner/trip-planner.component').then(c => c.TripPlannerComponent),
    canActivate: [authGuard],
  },
  {
    path: 'premium',
    loadComponent: () => import('./components/premium/premium.component').then(c => c.PremiumComponent),
  },
  { path: '**', redirectTo: '' },
];
