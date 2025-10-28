import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-saved-plans-page',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ 'savedPlansTitle' | l10n }}</h1>
      <p class="text-gray-600 mb-8">{{ 'savedPlansSubtitle' | l10n }}</p>

      @if (savedPlans().length > 0) {
        <div class="space-y-4">
          @for (plan of savedPlans(); track plan.id) {
            <a [routerLink]="['/plan', plan.id]" class="block p-4 border rounded-lg hover:shadow-md hover:border-teal-400 transition-all">
              <h2 class="font-bold text-lg text-gray-800">{{ plan.title }}</h2>
              <p class="text-sm text-gray-500">{{ plan.details.duration }} - {{ plan.details.travelers }}</p>
            </a>
          }
        </div>
      } @else {
        <div class="text-center py-12">
            <p class="text-gray-500">{{ 'noSavedPlans' | l10n }}</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedPlansPageComponent {
  private authService = inject(AuthService);
  savedPlans = this.authService.savedPlans;
}
