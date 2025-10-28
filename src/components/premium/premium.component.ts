import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { CommonModule } from '@angular/common';

const PREMIUM_COST_IN_POINTS = 1000;

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [L10nPipe, CommonModule],
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
        <p class="text-lg font-semibold text-green-600">{{ 'alreadyPremium' | l10n }}</p>
      } @else {
        <div class="space-y-4">
            <button (click)="upgradeToPremium()" class="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:scale-105 transition-transform duration-300">
              {{ 'becomePremium' | l10n }}
            </button>
            <div class="text-center">
                <button 
                  (click)="upgradeWithPoints()" 
                  [disabled]="!canAffordWithPoints()"
                  class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-transform duration-300 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {{ 'upgradeWithPoints' | l10n:PREMIUM_COST_IN_POINTS }}
                </button>
                @if(!canAffordWithPoints()) {
                  <p class="text-sm text-gray-500 mt-2">{{ 'notEnoughPoints' | l10n:(PREMIUM_COST_IN_POINTS - userPoints()) }}</p>
                }
            </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  PREMIUM_COST_IN_POINTS = PREMIUM_COST_IN_POINTS;

  isPremium = this.authService.isPremium;
  userPoints = computed(() => this.authService.currentUser()?.points.balance ?? 0);
  canAffordWithPoints = computed(() => this.userPoints() >= this.PREMIUM_COST_IN_POINTS);

  upgradeToPremium(): void {
    this.authService.becomePremium();
    this.toastService.show('Parabéns! Agora é um membro Premium.', 'success');
  }

  upgradeWithPoints(): void {
    const success = this.authService.spendPoints(this.PREMIUM_COST_IN_POINTS, 'Subscrição Premium');
    if (success) {
      this.authService.becomePremium();
      this.toastService.show('Premium desbloqueado com pontos! Parabéns!', 'success');
    } else {
      this.toastService.show('Não foi possível processar o pedido.', 'error');
    }
  }
}
