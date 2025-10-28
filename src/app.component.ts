import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { AuthService } from './services/auth.service';
import { L10nService } from './services/l10n.service';
import { L10nPipe } from './pipes/l10n.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ToastComponent, L10nPipe],
  template: `
    <div class="bg-gray-50 min-h-screen flex flex-col">
      <header class="bg-white shadow-md sticky top-0 z-40">
        <nav class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a routerLink="/" class="text-2xl font-bold text-teal-600">Juntos</a>
          <div class="flex items-center space-x-4">
            <a routerLink="/trip-planner" class="text-gray-600 hover:text-teal-600">{{ 'tripPlanner' | l10n }}</a>
            <a routerLink="/community" class="text-gray-600 hover:text-teal-600">{{ 'community' | l10n }}</a>
            <a routerLink="/suppliers" class="text-gray-600 hover:text-teal-600">{{ 'suppliers' | l10n }}</a>
            
            @if (isLoggedIn()) {
              <a routerLink="/profile" class="flex items-center space-x-2 text-gray-600 hover:text-teal-600">
                <span class="text-2xl">👤</span>
                <span>{{ currentUser()?.name }}</span>
              </a>
            } @else {
              <a routerLink="/login" class="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">{{ 'login' | l10n }}</a>
            }

            <div class="relative">
              <button (click)="showLanguageMenu.set(!showLanguageMenu())" class="text-2xl">🌐</button>
              @if (showLanguageMenu()) {
                <div class="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg py-1">
                  <button (click)="setLanguage('pt')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">PT 🇵🇹</button>
                  <button (click)="setLanguage('en')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">EN 🇬🇧</button>
                </div>
              }
            </div>
          </div>
        </nav>
      </header>
      <main class="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <router-outlet />
      </main>
      <footer class="bg-gray-800 text-white py-6">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {{ currentYear }} Juntos. {{ 'allRightsReserved' | l10n }}</p>
            <div class="mt-2">
              <a routerLink="/sos" class="text-red-400 hover:text-red-300 font-bold">{{ 'sos' | l10n }}</a>
            </div>
        </div>
      </footer>
      <app-toast />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private l10nService = inject(L10nService);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;
  currentYear = new Date().getFullYear();
  showLanguageMenu = signal(false);

  setLanguage(lang: 'pt' | 'en'): void {
    this.l10nService.setLanguage(lang);
    this.showLanguageMenu.set(false);
  }
}
