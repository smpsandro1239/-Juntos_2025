import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form (ngSubmit)="login()">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
          <input type="email" id="email" name="email" [(ngModel)]="email" required class="w-full px-3 py-2 border rounded-md" placeholder="user@example.com">
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
          <input type="password" id="password" name="password" [(ngModel)]="password" required class="w-full px-3 py-2 border rounded-md" placeholder="password">
        </div>
        @if(errorMessage()) {
            <p class="text-red-500 text-center mb-4">{{ errorMessage() }}</p>
        }
        <button type="submit" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600">Entrar</button>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'user@example.com';
  password = 'password';
  errorMessage = signal<string | null>(null);

  login(): void {
    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['/profile']);
    } else {
      this.errorMessage.set('Email ou password inválidos.');
    }
  }
}
