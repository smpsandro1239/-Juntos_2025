import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Event } from '../../models/event.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, L10nPipe],
  template: `
    @if (event()) {
      @let ev = event()!;
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <button routerLink="/" class="text-teal-500 hover:text-teal-700 mb-4">&larr; {{ 'backToActivities' | l10n }}</button>

        <header class="mb-6">
            <img [ngSrc]="ev.imageUrl" [alt]="ev.name" width="800" height="400" class="w-full h-64 object-cover rounded-lg shadow-md mb-6" priority>
            <h1 class="text-4xl font-extrabold text-gray-800">{{ ev.name }}</h1>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
                 <section>
                    <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'description' | l10n }}</h2>
                    <p class="text-gray-600 leading-relaxed">{{ ev.description }}</p>
                </section>
            </div>
            <aside>
                <div class="bg-gray-50 p-6 rounded-lg border">
                    <h3 class="text-xl font-bold mb-4">{{ 'eventDetails' | l10n }}</h3>
                    <div class="space-y-3">
                        <div class="flex items-start">
                          <span class="text-xl mr-3">🗓️</span>
                          <div>
                            <p class="font-semibold">{{ 'when' | l10n }}</p>
                            <p>{{ ev.startDate | date:'fullDate' }} - {{ ev.endDate | date:'fullDate' }}</p>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <span class="text-xl mr-3">📍</span>
                           <div>
                            <p class="font-semibold">{{ 'location' | l10n }}</p>
                            <p>{{ ev.location }}</p>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <span class="text-xl mr-3">💰</span>
                          <div>
                            <p class="font-semibold">{{ 'price' | l10n }}</p>
                            <p>{{ ev.price > 0 ? (ev.price | currency:'EUR') : ('free' | l10n) }}</p>
                          </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    } @else {
      <p>A carregar evento...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  
  event = signal<Event | undefined>(undefined);

  constructor() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.event.set(this.activityService.getEventById(eventId));
    }
  }
}
