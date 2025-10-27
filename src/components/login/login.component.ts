import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, L10nPipe],
  template: `
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">{{ 'loginTitle' | l10n }}</h2>
        </div>
        <form class="mt-8 space-y-6" #form="ngForm" (ngSubmit)="login(form.value)">
          @if (errorMessage()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ errorMessage() }}</span>
            </div>
          }
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">{{ 'email' | l10n }}</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required ngModel #email="ngModel" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="{{ 'email' | l10n }}">
            </div>
            <div>
              <label for="password" class="sr-only">{{ 'password' | l10n }}</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required ngModel #password="ngModel" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="{{ 'password' | l10n }}">
            </div>
          </div>
          <p class="text-sm text-center text-gray-500">{{ 'loginHint' | l10n }}</p>

          <div>
            <button type="submit" [disabled]="form.invalid" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400">
              {{ 'login' | l10n }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  errorMessage = signal<string | null>(null);

  login(formValue: {email: string; password: string}) {
    const success = this.authService.login(formValue.email, formValue.password);
    if (success) {
      this.router.navigate(['/profile']);
    } else {
      this.errorMessage.set('Email ou password inválidos.');
    }
  }
}
