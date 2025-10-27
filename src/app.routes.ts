import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'activity/:id', 
    loadComponent: () => import('./components/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'trip-planner', 
    loadComponent: () => import('./components/trip-planner/trip-planner.component').then(m => m.TripPlannerComponent)
  },
  { path: '**', redirectTo: '' }
];
