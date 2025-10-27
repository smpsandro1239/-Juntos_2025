import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { SuppliersPageComponent } from './components/suppliers-page/suppliers-page.component';
import { SupplierDetailComponent } from './components/supplier-detail/supplier-detail.component';
import { PremiumComponent } from './components/premium/premium.component';
import { AlbumsPageComponent } from './components/albums-page/albums-page.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';


export const appRoutes: Routes = [
    { path: '', component: HomeComponent, title: 'Descobrir' },
    { path: 'activity/:id', component: ActivityDetailComponent, title: 'Detalhe da Atividade' },
    { path: 'event/:id', component: EventDetailComponent, title: 'Detalhe do Evento' },
    { path: 'suppliers', component: SuppliersPageComponent, title: 'Fornecedores' },
    { path: 'supplier/:id', component: SupplierDetailComponent, title: 'Detalhe do Fornecedor' },
    { path: 'trip-planner', component: TripPlannerComponent, canActivate: [authGuard], title: 'Roteiro IA' },
    { path: 'login', component: LoginComponent, title: 'Entrar' },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Perfil' },
    { path: 'premium', component: PremiumComponent, title: 'Premium' },
    { path: 'albums', component: AlbumsPageComponent, canActivate: [authGuard], title: 'Álbuns de Fotos' },
    { path: 'album/:id', component: AlbumDetailComponent, canActivate: [authGuard], title: 'Detalhe do Álbum' },
    { path: '**', redirectTo: '' }
];
