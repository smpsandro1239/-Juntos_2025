import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { L10nService } from './services/l10n.service';
import { L10nPipe } from './pipes/l10n.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, L10nPipe],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-teal-500">Miúdos&Cia</a>
        <div class="flex items-center space-x-4">
          <a routerLink="/" routerLinkActive="text-teal-500" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:text-teal-500">{{ 'navHome' | l10n }}</a>
          <a routerLink="/suppliers" routerLinkActive="text-teal-500" class="text-gray-600 hover:text-teal-500">{{ 'navSuppliers' | l10n }}</a>
          
          @if (authService.isLoggedIn()) {
            <a routerLink="/passport" routerLinkActive="text-teal-500" class="text-gray-600 hover:text-teal-500">{{ 'navPassport' | l10n }}</a>
            <a routerLink="/profile" routerLinkActive="text-teal-500" class="text-gray-600 hover:text-teal-500">{{ 'navProfile' | l10n }}</a>
            <button (click)="logout()" class="text-gray-600 hover:text-teal-500">{{ 'navLogout' | l10n }}</button>
          } @else {
            <a routerLink="/login" routerLinkActive="text-teal-500" class="text-gray-600 hover:text-teal-500">{{ 'navLogin' | l10n }}</a>
          }
          <a routerLink="/sos" class="text-red-500 font-bold hover:text-red-700">{{ 'navSOS' | l10n }}</a>
          
          <div class="flex items-center border rounded-md">
            <button (click)="l10n.setLanguage('pt')" class="px-2 py-1 text-sm rounded-l-md" [class.bg-teal-500]="l10n.language() === 'pt'" [class.text-white]="l10n.language() === 'pt'">PT</button>
            <button (click)="l10n.setLanguage('en')" class="px-2 py-1 text-sm rounded-r-md" [class.bg-teal-500]="l10n.language() === 'en'" [class.text-white]="l10n.language() === 'en'">EN</button>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-800 text-white p-6 mt-8">
        <div class="container mx-auto text-center">
            <p>&copy; 2024 Miúdos&Cia. Todos os direitos reservados.</p>
        </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  authService = inject(AuthService);
  l10n = inject(L10nService);

  logout() {
    this.authService.logout();
  }
}
