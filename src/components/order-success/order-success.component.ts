import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink, L10nPipe],
  template: `
    <div class="text-center bg-white p-12 rounded-lg shadow-lg max-w-lg mx-auto">
        <svg class="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-3xl font-bold text-gray-800 mt-4">{{ 'orderSuccessTitle' | l10n }}</h1>
        <p class="text-gray-600 mt-2">{{ 'orderSuccessMessage' | l10n }}</p>
        <a routerLink="/profile" class="mt-8 inline-block bg-teal-500 text-white font-bold py-3 px-6 rounded hover:bg-teal-600 transition-colors">
            {{ 'backToProfile' | l10n }}
        </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSuccessComponent {}
