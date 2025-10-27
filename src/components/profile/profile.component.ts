import { Component, ChangeDetectionStrategy, inject, Signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    @if (user()) {
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
        <h2 class="text-2xl font-bold mb-6 text-center">Your Profile</h2>
        <div class="mb-4">
          <p class="text-gray-600"><strong>Name:</strong> {{ user()?.name }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-600"><strong>Email:</strong> {{ user()?.email }}</p>
        </div>
        <div class="mt-6 text-center">
          <button (click)="logout()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: Signal<User | null> = this.authService.currentUser;

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
