import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [RouterLink, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
        @if (isUpgraded()) {
            <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 class="mt-4 text-2xl font-bold text-gray-800">{{ 'upgradeSuccess' | l10n }}</h2>
                <p class="mt-2 text-gray-600">Agora tem acesso a todas as funcionalidades exclusivas.</p>
                <a routerLink="/profile" class="mt-6 inline-block bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors">
                    {{ 'backToProfile' | l10n }}
                </a>
            </div>
        } @else {
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ 'premiumTitle' | l10n }}</h1>
            <p class="text-gray-600 mb-8">Desbloqueie o potencial máximo da sua aventura em família.</p>
            
            <div class="bg-gray-50 p-6 rounded-lg border text-left mb-8">
                <h2 class="text-xl font-semibold mb-4">{{ 'premiumBenefits' | l10n }}</h2>
                <ul class="space-y-3">
                    <li class="flex items-start">
                        <span class="text-green-500 mr-3 mt-1">✓</span>
                        <span>{{ 'premiumBenefit1' | l10n }}</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-3 mt-1">✓</span>
                        <span>{{ 'premiumBenefit2' | l10n }}</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-3 mt-1">✓</span>
                        <span>{{ 'premiumBenefit3' | l10n }}</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-3 mt-1">✓</span>
                        <span>{{ 'premiumBenefit4' | l10n }}</span>
                    </li>
                </ul>
            </div>
            
            <button (click)="upgrade()" class="w-full bg-yellow-500 text-white py-3 rounded-md font-bold text-lg hover:bg-yellow-600 transition-colors">
                {{ 'upgradeNow' | l10n }} - 29.99€/ano
            </button>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent {
  private authService = inject(AuthService);
  isUpgraded = signal(false);

  upgrade() {
    this.authService.upgradeToPremium();
    this.isUpgraded.set(true);
  }
}
