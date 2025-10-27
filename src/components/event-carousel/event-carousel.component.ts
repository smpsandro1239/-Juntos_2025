import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, NgOptimizedImage, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, DatePipe],
  template: `
    <div class="relative">
        <div class="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory">
            @for (event of events(); track event.id) {
                <div [routerLink]="['/event', event.id]" class="snap-center flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
                    <img [ngSrc]="event.imageUrl" [alt]="event.name" width="320" height="180" class="w-full h-40 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-lg">{{ event.name }}</h3>
                        <p class="text-sm text-gray-600">{{ event.location }}</p>
                        <p class="text-sm text-gray-500 mt-2">{{ event.startDate | date:'dd MMM' }} - {{ event.endDate | date:'dd MMM, yyyy' }}</p>
                    </div>
                </div>
            }
        </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCarouselComponent {
    events = input.required<Event[]>();
}
