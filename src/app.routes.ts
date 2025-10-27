import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { PremiumComponent } from './components/premium/premium.component';
import { PassportComponent } from './components/passport/passport.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { SuppliersPageComponent } from './components/suppliers-page/suppliers-page.component';
import { SupplierDetailComponent } from './components/supplier-detail/supplier-detail.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'activity/:id', component: ActivityDetailComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'passport', component: PassportComponent, canActivate: [authGuard] },
  { path: 'trip-planner', component: TripPlannerComponent, canActivate: [authGuard] },
  { path: 'premium', component: PremiumComponent },
  { path: 'suppliers', component: SuppliersPageComponent },
  { path: 'supplier/:id', component: SupplierDetailComponent },
  { path: '**', redirectTo: '' }
];
