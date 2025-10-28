import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
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
  {
    path: 'premium',
    loadComponent: () => import('./components/premium/premium.component').then(m => m.PremiumComponent)
  },
  {
    path: 'passport',
    loadComponent: () => import('./components/passport/passport.component').then(m => m.PassportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./components/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./components/suppliers-page/suppliers-page.component').then(m => m.SuppliersPageComponent)
  },
  {
    path: 'supplier/:id',
    loadComponent: () => import('./components/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent)
  },
  {
    path: 'albums',
    loadComponent: () => import('./components/albums-page/albums-page.component').then(m => m.AlbumsPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./components/album-detail/album-detail.component').then(m => m.AlbumDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order-print/:albumId',
    loadComponent: () => import('./components/order-print/order-print.component').then(m => m.OrderPrintComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order-success',
    loadComponent: () => import('./components/order-success/order-success.component').then(m => m.OrderSuccessComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order-history',
    loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'sos',
    loadComponent: () => import('./components/sos-page/sos-page.component').then(m => m.SosPageComponent)
  },
  {
    path: 'points',
    loadComponent: () => import('./components/points-history/points-history.component').then(m => m.PointsHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'missions',
    loadComponent: () => import('./components/missions-page/missions-page.component').then(m => m.MissionsPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'saved-plans',
    loadComponent: () => import('./components/saved-plans-page/saved-plans-page.component').then(m => m.SavedPlansPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'plan/:id',
    loadComponent: () => import('./components/plan-detail/plan-detail.component').then(m => m.PlanDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'community',
    loadComponent: () => import('./components/community-page/community-page.component').then(m => m.CommunityPageComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./components/post-detail/post-detail.component').then(m => m.PostDetailComponent)
  },
  {
    path: 'create-post',
    loadComponent: () => import('./components/create-post/create-post.component').then(m => m.CreatePostComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
