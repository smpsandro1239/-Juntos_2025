import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { authGuard } from './guards/auth.guard';
import { SuppliersPageComponent } from './components/suppliers-page/suppliers-page.component';
import { SupplierDetailComponent } from './components/supplier-detail/supplier-detail.component';
import { SosPageComponent } from './components/sos-page/sos-page.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { AlbumsPageComponent } from './components/albums-page/albums-page.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { FavoritesPageComponent } from './components/favorites-page/favorites-page.component';
import { MissionsPageComponent } from './components/missions-page/missions-page.component';
import { PointsHistoryComponent } from './components/points-history/points-history.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PassportComponent } from './components/passport/passport.component';
import { PremiumComponent } from './components/premium/premium.component';
import { SavedPlansPageComponent } from './components/saved-plans-page/saved-plans-page.component';
import { PlanDetailComponent } from './components/plan-detail/plan-detail.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'activity/:id', component: ActivityDetailComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'suppliers', component: SuppliersPageComponent },
  { path: 'supplier/:id', component: SupplierDetailComponent },
  { path: 'sos', component: SosPageComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'trip-planner', 
    component: TripPlannerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'saved-plans',
    component: SavedPlansPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'plan/:id',
    component: PlanDetailComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'albums', 
    component: AlbumsPageComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'album/:id', 
    component: AlbumDetailComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'order-print/:albumId', 
    component: OrderPrintComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'order-success', 
    component: OrderSuccessComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: OrderHistoryComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'favorites', 
    component: FavoritesPageComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'missions', 
    component: MissionsPageComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'points', 
    component: PointsHistoryComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'passport', 
    component: PassportComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'premium',
    component: PremiumComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
