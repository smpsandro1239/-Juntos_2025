import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, NgOptimizedImage, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../models/event.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, L10nPipe, DatePipe],
  template: `
    <div class="relative">
      <div class="flex overflow-x-auto space-x-4 pb-4 -mb-4 scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-gray-100">
        @for (event of events(); track event.id) {
          <div class="flex-shrink-0 w-80">
            <a [routerLink]="['/event', event.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img [ngSrc]="event.imageUrl" [alt]="event.name" width="320" height="180" class="w-full h-40 object-cover">
              <div class="p-4">
                <h3 class="font-bold text-md text-gray-800 truncate">{{ event.name }}</h3>
                <p class="text-sm text-gray-500">{{ event.location }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ event.startDate | date:'mediumDate' }}</p>
              </div>
            </a>
          </div>
        } @empty {
            <div class="text-center py-12">
                <p class="text-gray-500">No upcoming events.</p>
            </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-thin {
      scrollbar-width: thin;
      scrollbar-color: #5eead4 #f3f4f6;
    }
    .scrollbar-thin::-webkit-scrollbar {
      height: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 3px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background-color: #5eead4;
      border-radius: 3px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCarouselComponent {
  events = input.required<Event[]>();
}
