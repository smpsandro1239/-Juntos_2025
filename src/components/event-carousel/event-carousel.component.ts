import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative">
      <div class="flex space-x-4 overflow-x-auto pb-4 -mb-4 snap-x snap-mandatory">
        @for (event of events(); track event.id) {
          <div class="snap-start flex-shrink-0 w-80">
            <a [routerLink]="['/event', event.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
              <img [src]="event.imageUrl" [alt]="event.name" class="w-full h-40 object-cover">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-1 truncate">{{ event.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ formatDate(event.startDate) }}</p>
                <p class="text-sm text-gray-500 truncate">{{ event.location }}</p>
              </div>
            </a>
          </div>
        }
        @if (events().length === 0) {
          <p class="text-gray-500">Não há eventos agendados.</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCarouselComponent {
  private activityService = inject(ActivityService);
  events: Signal<Event[]> = this.activityService.upcomingEvents;

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
    });
  }
}
