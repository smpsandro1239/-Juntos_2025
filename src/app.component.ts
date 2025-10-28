import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { L10nService } from './services/l10n.service';
import { L10nPipe } from './pipes/l10n.pipe';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, L10nPipe, ToastComponent],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-40">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-teal-600">Juntos</a>
        
        <div class="hidden md:flex items-center space-x-6">
          <a routerLink="/" class="text-gray-600 hover:text-teal-600">{{ 'home' | l10n }}</a>
          @if (isLoggedIn()) {
            <a routerLink="/trip-planner" class="text-gray-600 hover:text-teal-600">{{ 'tripPlanner' | l10n }}</a>
          }
          <a routerLink="/suppliers" class="text-gray-600 hover:text-teal-600">{{ 'suppliers' | l10n }}</a>
          <a routerLink="/sos" class="text-gray-600 hover:text-teal-600 font-semibold text-red-500">{{ 'sos' | l10n }}</a>
        </div>

        <div class="flex items-center space-x-4">
          @if (isLoggedIn()) {
            <a routerLink="/profile" class="font-medium text-gray-600 hover:text-teal-600">{{ currentUser()?.name }}</a>
            <button (click)="logout()" class="text-sm text-gray-500 hover:underline">{{ 'logout' | l10n }}</button>
          } @else {
            <a routerLink="/login" class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">{{ 'login' | l10n }}</a>
          }
          <div class="flex items-center">
            <button (click)="setLang('pt')" class="px-2 font-bold" [class.text-teal-600]="currentLang() === 'pt'">PT</button>
            <span class="text-gray-300">|</span>
            <button (click)="setLang('en')" class="px-2 font-bold" [class.text-teal-600]="currentLang() === 'en'">EN</button>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-4 md:p-6 lg:p-8">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-100 mt-12">
        <div class="container mx-auto px-6 py-4 text-center text-gray-500 text-sm">
            &copy; {{ currentYear }} Juntos. All rights reserved.
        </div>
    </footer>
    
    <app-toast></app-toast>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private l10nService = inject(L10nService);
  
  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;
  currentLang = this.l10nService.language;
  currentYear = new Date().getFullYear();

  logout(): void {
    this.authService.logout();
  }

  setLang(lang: 'pt' | 'en'): void {
    this.l10nService.setLanguage(lang);
  }
}
