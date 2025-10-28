import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { SosPageComponent } from './components/sos-page/sos-page.component';
import { SuppliersPageComponent } from './components/suppliers-page/suppliers-page.component';
import { SupplierDetailComponent } from './components/supplier-detail/supplier-detail.component';
import { PremiumComponent } from './components/premium/premium.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'activity/:id', component: ActivityDetailComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'suppliers', component: SuppliersPageComponent },
  { path: 'supplier/:id', component: SupplierDetailComponent },
  { path: 'trip-planner', component: TripPlannerComponent, canActivate: [authGuard] },
  { path: 'sos', component: SosPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'premium', component: PremiumComponent, canActivate: [authGuard] },
  { path: 'album/:id', component: AlbumDetailComponent, canActivate: [authGuard] },
  { path: 'order-print/:albumId', component: OrderPrintComponent, canActivate: [authGuard] },
  { path: 'order-success', component: OrderSuccessComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
