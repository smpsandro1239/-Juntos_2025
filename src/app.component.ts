import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { L10nService } from './services/l10n.service';
import { L10nPipe } from './pipes/l10n.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, L10nPipe],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-40">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-teal-600">+JUNTOS</a>
        <div class="flex items-center space-x-4">
          <a routerLink="/" routerLinkActive="text-teal-600" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:text-teal-500">{{ 'navHome' | l10n }}</a>
          <a routerLink="/suppliers" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-500">{{ 'navSuppliers' | l10n }}</a>
          <a routerLink="/trip-planner" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-500">{{ 'navTripPlanner' | l10n }}</a>
          <a routerLink="/sos" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-500">{{ 'navSOS' | l10n }}</a>
          
          @if (authService.isLoggedIn()) {
            <a routerLink="/profile" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-500">{{ 'navProfile' | l10n }}</a>
            <button (click)="logout()" class="text-gray-600 hover:text-teal-500">{{ 'navLogout' | l10n }}</button>
          } @else {
            <a routerLink="/login" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-teal-500">{{ 'navLogin' | l10n }}</a>
          }
          
          <div class="flex items-center">
            <button (click)="setLang('pt')" [class.font-bold]="l10nService.language() === 'pt'" class="px-2">PT</button>
            <span class="text-gray-300">|</span>
            <button (click)="setLang('en')" [class.font-bold]="l10nService.language() === 'en'" class="px-2">EN</button>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-800 text-white p-6 mt-12">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 +JUNTOS. {{ 'footerRights' | l10n }}</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  authService = inject(AuthService);
  l10nService = inject(L10nService);

  logout() {
    this.authService.logout();
  }

  setLang(lang: 'pt' | 'en') {
    this.l10nService.setLanguage(lang);
  }
}