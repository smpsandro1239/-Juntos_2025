import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'activity/:id',
    loadComponent: () => import('./components/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent),
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./components/event-detail/event-detail.component').then(m => m.EventDetailComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'passport',
    loadComponent: () => import('./components/passport/passport.component').then(m => m.PassportComponent),
    canActivate: [authGuard],
  },
  {
    path: 'trip-planner',
    loadComponent: () => import('./components/trip-planner/trip-planner.component').then(m => m.TripPlannerComponent),
    canActivate: [authGuard],
  },
  {
    path: 'premium',
    loadComponent: () => import('./components/premium/premium.component').then(m => m.PremiumComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
