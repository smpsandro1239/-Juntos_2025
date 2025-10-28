import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-points-history',
  standalone: true,
  imports: [CommonModule, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'pointsHistory' | l10n }}</h1>
      
      <div class="bg-teal-50 p-6 rounded-lg border border-teal-200 mb-6">
        <p class="text-sm text-teal-800">{{ 'currentBalance' | l10n }}</p>
        <p class="text-4xl font-bold text-teal-600">{{ balance() }} <span class="text-2xl">{{ 'points' | l10n }}</span></p>
      </div>

      @if (transactions().length > 0) {
        <div class="space-y-3">
            @for (transaction of transactions(); track transaction.id) {
                <div class="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p class="font-semibold">{{ transaction.description }}</p>
                        <p class="text-sm text-gray-500">{{ transaction.date | date:'medium' }}</p>
                    </div>
                    <div>
                        <p 
                          class="font-bold text-lg"
                          [class.text-green-600]="transaction.points > 0"
                          [class.text-red-600]="transaction.points < 0"
                        >
                          {{ transaction.points > 0 ? '+' : '' }}{{ transaction.points }}
                        </p>
                    </div>
                </div>
            }
        </div>
      } @else {
        <p class="text-gray-500 text-center py-8">{{ 'noTransactions' | l10n }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsHistoryComponent {
    private authService = inject(AuthService);
    
    private pointsData = computed(() => this.authService.currentUser()?.points);

    balance = computed(() => this.pointsData()?.balance ?? 0);
    transactions = computed(() => this.pointsData()?.transactions.slice().reverse() ?? []);
}
