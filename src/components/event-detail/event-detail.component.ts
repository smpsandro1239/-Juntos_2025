import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, DatePipe, CurrencyPipe],
  template: `
    @if(event(); as evt) {
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <img [ngSrc]="evt.imageUrl" [alt]="evt.name" width="800" height="400" class="w-full h-64 object-cover rounded-lg mb-6">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ evt.name }}</h1>
            <div class="text-gray-500 mb-4 flex items-center space-x-4">
                <span>📍 {{ evt.location }}</span>
                <span>📅 {{ evt.startDate | date:'fullDate' }} - {{ evt.endDate | date:'fullDate' }}</span>
            </div>
            <p class="text-gray-700 mb-6">{{ evt.description }}</p>
            
            <div class="flex justify-end items-center p-4 bg-gray-50 rounded-md">
                <span class="text-2xl font-bold text-teal-600">
                    {{ evt.price > 0 ? (evt.price | currency:'EUR') : 'Grátis' }}
                </span>
                <button class="ml-4 bg-teal-500 text-white py-2 px-6 rounded-md hover:bg-teal-600">Quero Ir!</button>
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
        this.event.set(this.activityService.getEventById(eventId));
    }
}
