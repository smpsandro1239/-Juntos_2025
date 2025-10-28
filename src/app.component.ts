import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { L10nService } from './services/l10n.service';
import { ToastComponent } from './components/toast/toast.component';
import { L10nPipe } from './pipes/l10n.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, L10nPipe],
  template: `
    <div class="bg-gray-100 min-h-screen font-sans text-gray-800">
      <nav class="bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <a routerLink="/" class="flex-shrink-0 text-2xl font-bold text-teal-500">
                Juntos
              </a>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <a routerLink="/" routerLinkActive="bg-teal-50 text-teal-600" [routerLinkActiveOptions]="{ exact: true }" class="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">{{ 'home' | l10n }}</a>
                  <a routerLink="/trip-planner" routerLinkActive="bg-teal-50 text-teal-600" class="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">{{ 'tripPlanner' | l10n }}</a>
                  <a routerLink="/suppliers" routerLinkActive="bg-teal-50 text-teal-600" class="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">{{ 'suppliers' | l10n }}</a>
                  <a routerLink="/community" routerLinkActive="bg-teal-50 text-teal-600" class="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">{{ 'community' | l10n }}</a>
                  <a routerLink="/sos" routerLinkActive="bg-red-50 text-red-600" class="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">🆘 SOS</a>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
               <div class="relative">
                 <button (click)="toggleLanguage()" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                   {{ l10n.language() === 'pt' ? 'PT 🇵🇹' : 'EN 🇬🇧' }}
                 </button>
               </div>
               @if (authService.isLoggedIn()) {
                <a routerLink="/profile" class="flex items-center space-x-2 text-gray-600 hover:text-teal-600">
                  <span class="w-8 h-8 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center font-bold">
                    {{ authService.currentUser()?.name.charAt(0) }}
                  </span>
                  <span class="hidden sm:inline">{{ 'profile' | l10n }}</span>
                </a>
               } @else {
                 <a routerLink="/login" class="bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-600">{{ 'login' | l10n }}</a>
               }
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="bg-white mt-12">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Juntos App. {{ 'allRightsReserved' | l10n }}.</p>
        </div>
      </footer>
    </div>
    <app-toast />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  authService = inject(AuthService);
  l10n = inject(L10nService);

  toggleLanguage(): void {
    const currentLang = this.l10n.language();
    this.l10n.setLanguage(currentLang === 'pt' ? 'en' : 'pt');
  }
}
