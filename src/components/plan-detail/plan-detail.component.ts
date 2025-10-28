import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe, MarkdownPipe],
  template: `
    @if(plan(); as p) {
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <a routerLink="/saved-plans" class="text-teal-500 hover:text-teal-700 mb-4 inline-block">&larr; {{ 'backToSavedPlans' | l10n }}</a>
        <h1 class="text-3xl font-bold text-gray-800">{{ p.title }}</h1>
        <p class="text-gray-600 mt-1">{{ p.details.destination }} | {{ p.details.duration }} | {{ p.details.travelers }}</p>
        <p class="text-sm text-gray-500 mt-2"><b>{{ 'interests' | l10n }}:</b> {{ p.details.interests.join(', ') }}</p>

        <div class="mt-8 space-y-6">
          @for(day of p.plan; track day.day) {
            <div class="border-l-4 border-teal-500 pl-4">
              <h2 class="text-2xl font-bold text-gray-700">{{ day.title }}</h2>
              <div class="prose max-w-none mt-2" [innerHTML]="day.activities | markdown"></div>
            </div>
          }
        </div>
      </div>
    } @else {
      <p>A carregar plano...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  planId = signal(0);
  plan = computed(() => this.authService.getPlanById(this.planId()));

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.planId.set(id);
  }
}
