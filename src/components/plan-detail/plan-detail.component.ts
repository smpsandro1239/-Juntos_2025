import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TripPlan } from '../../models/trip-plan.model';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MarkdownPipe, L10nPipe],
  template: `
    @if (plan()) {
      @let p = plan()!;
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <a routerLink="/saved-plans" class="text-teal-500 hover:text-teal-700 mb-4 inline-block">&larr; {{ 'savedPlans' | l10n }}</a>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ p.title }}</h1>
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-6">
          <span><strong>{{ 'duration' | l10n }}:</strong> {{ p.details.duration }}</span>
          <span><strong>{{ 'travelers' | l10n }}:</strong> {{ p.details.travelers }}</span>
          <span><strong>{{ 'interests' | l10n }}:</strong> {{ p.details.interests.join(', ') }}</span>
        </div>
        <div class="prose max-w-none" [innerHTML]="p.description | markdown"></div>
      </div>
    } @else {
      <p>A carregar plano...</p>
    }
  `,
  styles: [`
    .prose h1, .prose h2, .prose h3 {
      font-weight: bold;
      margin-bottom: 0.5em;
      margin-top: 1em;
    }
    .prose h1 { font-size: 1.875rem; }
    .prose h2 { font-size: 1.5rem; }
    .prose h3 { font-size: 1.25rem; }
    .prose p { margin-bottom: 1em; }
    .prose ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1em; }
    .prose li { margin-bottom: 0.25em; }
    .prose strong { font-weight: bold; }
    .prose em { font-style: italic; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  plan = signal<TripPlan | undefined>(undefined);

  constructor() {
    const planId = Number(this.route.snapshot.paramMap.get('id'));
    if (planId) {
      this.plan.set(this.authService.getPlanById(planId));
    }
  }
}
