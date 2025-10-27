import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-gray-800">CityExplorer</a>
        <div class="flex items-center space-x-4">
          <a routerLink="/" routerLinkActive="text-blue-600" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:text-blue-600">Discover</a>
          <a routerLink="/trip-planner" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600">AI Planner</a>
          @if (isLoggedIn()) {
            <a routerLink="/profile" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600">Profile</a>
            <button (click)="logout()" class="text-gray-600 hover:text-blue-600">Logout</button>
          } @else {
            <a routerLink="/login" routerLinkActive="text-blue-600" class="text-gray-600 hover:text-blue-600">Login</a>
          }
        </div>
      </nav>
    </header>
    <main class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <router-outlet></router-outlet>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  
  isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;
  
  logout(): void {
    this.authService.logout();
  }
}
