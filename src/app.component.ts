
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { L10nService } from './services/l10n.service';
import { AuthService } from './services/auth.service';
import { ToastComponent } from './components/toast/toast.component';
import { L10nPipe } from './pipes/l10n.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, L10nPipe],
  template: `
    <div class="bg-gray-100 min-h-screen font-sans">
      <nav class="bg-white shadow-md sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <a routerLink="/" class="text-2xl font-bold text-teal-500">Juntos</a>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <a routerLink="/" routerLinkActive="text-teal-500 border-b-2 border-teal-500" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium">{{ 'home' | l10n }}</a>
                  <a routerLink="/trip-planner" routerLinkActive="text-teal-500 border-b-2 border-teal-500" class="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium">{{ 'tripPlanner' | l10n }}</a>
                  <a routerLink="/community" routerLinkActive="text-teal-500 border-b-2 border-teal-500" class="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium">{{ 'community' | l10n }}</a>
                  <a routerLink="/suppliers" routerLinkActive="text-teal-500 border-b-2 border-teal-500" class="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium">{{ 'suppliers' | l10n }}</a>
                  <a routerLink="/sos" routerLinkActive="text-red-500 border-b-2 border-red-500" class="text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium">🆘 SOS</a>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              @if(isLoggedIn()) {
                <a routerLink="/profile" class="flex items-center text-gray-700 hover:text-teal-500">
                  <span class="mr-2">{{ user()?.name }}</span>
                  <div class="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                    {{ userInitial() }}
                  </div>
                </a>
              } @else {
                <a routerLink="/login" class="bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-600">{{ 'login' | l10n }}</a>
              }
              <div class="relative">
                <select (change)="setLanguage($any($event).target.value)" [value]="currentLang()" class="appearance-none bg-transparent border-none text-sm cursor-pointer p-2">
                  <option value="pt">🇵🇹 PT</option>
                  <option value="en">🇬🇧 EN</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="bg-white mt-8 py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
              <p>&copy; 2024 Juntos. {{ 'footerRights' | l10n }}</p>
          </div>
      </footer>
      
      <app-toast></app-toast>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private l10nService = inject(L10nService);
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  user = this.authService.currentUser;
  
  userInitial = computed(() => {
    const name = this.user()?.name;
    return name ? name.charAt(0).toUpperCase() : '';
  });

  currentLang = this.l10nService.language;

  setLanguage(lang: 'en' | 'pt'): void {
    this.l10nService.setLanguage(lang);
  }
}
