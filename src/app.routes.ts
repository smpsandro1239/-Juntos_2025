import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), title: 'Descobrir' },
    { path: 'activity/:id', loadComponent: () => import('./components/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent), title: 'Detalhe da Atividade' },
    { path: 'event/:id', loadComponent: () => import('./components/event-detail/event-detail.component').then(m => m.EventDetailComponent), title: 'Detalhe do Evento' },
    { path: 'suppliers', loadComponent: () => import('./components/suppliers-page/suppliers-page.component').then(m => m.SuppliersPageComponent), title: 'Fornecedores' },
    { path: 'supplier/:id', loadComponent: () => import('./components/supplier-detail/supplier-detail.component').then(m => m.SupplierDetailComponent), title: 'Detalhe do Fornecedor' },
    { path: 'trip-planner', loadComponent: () => import('./components/trip-planner/trip-planner.component').then(m => m.TripPlannerComponent), canActivate: [authGuard], title: 'Roteiro IA' },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), title: 'Entrar' },
    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard], title: 'Perfil' },
    { path: 'premium', loadComponent: () => import('./components/premium/premium.component').then(m => m.PremiumComponent), title: 'Premium' },
    { path: 'passport', loadComponent: () => import('./components/passport/passport.component').then(m => m.PassportComponent), canActivate: [authGuard], title: 'Passaporte' },
    { path: 'albums', loadComponent: () => import('./components/albums-page/albums-page.component').then(m => m.AlbumsPageComponent), canActivate: [authGuard], title: 'Álbuns de Fotos' },
    { path: 'album/:id', loadComponent: () => import('./components/album-detail/album-detail.component').then(m => m.AlbumDetailComponent), canActivate: [authGuard], title: 'Detalhe do Álbum' },
    { path: 'order-print/:albumId', loadComponent: () => import('./components/order-print/order-print.component').then(m => m.OrderPrintComponent), canActivate: [authGuard], title: 'Imprimir Álbum' },
    { path: 'order-success', loadComponent: () => import('./components/order-success/order-success.component').then(m => m.OrderSuccessComponent), canActivate: [authGuard], title: 'Encomenda Recebida' },
    { path: 'orders', loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent), canActivate: [authGuard], title: 'Minhas Encomendas' },
    { path: '**', redirectTo: '' }
];
