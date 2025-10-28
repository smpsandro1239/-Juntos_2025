import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { PassportComponent } from '../passport/passport.component';
import { AlbumsPageComponent } from '../albums-page/albums-page.component';
import { FavoritesPageComponent } from '../favorites-page/favorites-page.component';
import { MissionsPageComponent } from '../missions-page/missions-page.component';
import { PointsHistoryComponent } from '../points-history/points-history.component';
import { OrderHistoryComponent } from '../order-history/order-history.component';

type ProfileTab = 'passport' | 'albums' | 'favorites' | 'missions' | 'points' | 'orders';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    L10nPipe,
    PassportComponent,
    AlbumsPageComponent,
    FavoritesPageComponent,
    MissionsPageComponent,
    PointsHistoryComponent,
    OrderHistoryComponent
  ],
  template: `
    @if (user()) {
      @let u = user()!;
      <div class="max-w-6xl mx-auto">
        <header class="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
            <h1 class="text-3xl font-bold text-gray-800">Bem-vindo, {{ u.name }}!</h1>
            @if (!u.isPremium) {
                <div class="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg">
                    <p>{{ 'notPremium' | l10n }} <a routerLink="/premium" class="font-bold hover:underline">{{ 'upgradeHere' | l10n }}</a></p>
                </div>
            }
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside class="md:col-span-1">
                <nav class="bg-white p-4 rounded-lg shadow-md space-y-1 sticky top-24">
                    @for (tab of tabs; track tab.id) {
                        <button (click)="activeTab.set(tab.id)" 
                                class="w-full text-left px-4 py-2 rounded-md transition-colors font-medium"
                                [class.bg-teal-100]="activeTab() === tab.id"
                                [class.text-teal-700]="activeTab() === tab.id"
                                [class.hover:bg-gray-100]="activeTab() !== tab.id">
                            {{ tab.label | l10n }}
                        </button>
                    }
                </nav>
            </aside>

            <main class="md:col-span-3">
                @switch (activeTab()) {
                    @case ('passport') { <app-passport /> }
                    @case ('albums') { <app-albums-page /> }
                    @case ('favorites') { <app-favorites-page /> }
                    @case ('missions') { <app-missions-page /> }
                    @case ('points') { <app-points-history /> }
                    @case ('orders') { <app-order-history /> }
                }
            </main>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;
  
  activeTab = signal<ProfileTab>('passport');

  tabs: {id: ProfileTab, label: string}[] = [
    { id: 'passport', label: 'passportTitle' },
    { id: 'albums', label: 'yourAlbums' },
    { id: 'favorites', label: 'myFavorites' },
    { id: 'missions', label: 'missions' },
    { id: 'points', label: 'pointsHistory' },
    { id: 'orders', label: 'orderHistory' },
  ];
}
