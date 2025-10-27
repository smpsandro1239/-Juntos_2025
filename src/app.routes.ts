import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, title: '+JUNTOS | Descobrir' },
  { path: 'activity/:id', component: ActivityDetailComponent, title: '+JUNTOS | Detalhe' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
