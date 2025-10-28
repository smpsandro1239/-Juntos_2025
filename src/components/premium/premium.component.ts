import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
        {{ 'premiumTitle' | l10n }}
      </h1>
      <p class="text-gray-600 text-lg mb-10">{{ 'premiumSubtitle' | l10n }}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
        <div class="bg-gray-50 p-6 rounded-lg border">
          <h2 class="text-xl font-bold text-gray-800 mb-2">✨ {{ 'premiumFeature1' | l10n }}</h2>
          <p class="text-gray-600">{{ 'premiumFeature1Desc' | l10n }}</p>
        </div>
        <div class="bg-gray-50 p-6 rounded-lg border">
          <h2 class="text-xl font-bold text-gray-800 mb-2">📸 {{ 'premiumFeature2' | l10n }}</h2>
          <p class="text-gray-600">{{ 'premiumFeature2Desc' | l10n }}</p>
        </div>
        <div class="bg-gray-50 p-6 rounded-lg border">
          <h2 class="text-xl font-bold text-gray-800 mb-2">💰 {{ 'premiumFeature3' | l10n }}</h2>
          <p class="text-gray-600">{{ 'premiumFeature3Desc' | l10n }}</p>
        </div>
      </div>
      
      @if (isPremium()) {
        <p class="text-lg font-semibold text-green-600">Obrigado por ser um membro Premium!</p>
      } @else {
        <button (click)="upgradeToPremium()" class="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:scale-105 transition-transform duration-300">
          {{ 'becomePremium' | l10n }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isPremium = this.authService.isPremium;

  upgradeToPremium(): void {
    this.authService.becomePremium();
    this.toastService.show('Parabéns! Agora é um membro Premium.', 'success');
  }
}
