import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto mt-8">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
        @if (errorMessage()) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span class="block sm:inline">{{ errorMessage() }}</span>
          </div>
        }
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
            <input type="email" id="email" formControlName="email"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <p class="text-red-500 text-xs italic">Please enter a valid email.</p>
            }
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
            <input type="password" id="password" formControlName="password"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                   [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-500 text-xs italic">Password is required.</p>
            }
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" [disabled]="loginForm.invalid"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
              Sign In
            </button>
          </div>
        </form>
         <div class="mt-4 text-sm text-gray-600">
          <p>Use <strong>user@example.com</strong> and <strong>password</strong> to log in.</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['user@example.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    const success = this.authService.login(email!, password!);
    if (!success) {
      this.errorMessage.set('Invalid email or password.');
    }
  }
}
