import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (event()) {
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-flex items-center text-teal-600 hover:underline mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            Voltar a Descobrir
        </a>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="event()?.imageUrl" [alt]="event()?.name" class="w-full h-64 object-cover">
          <div class="p-6">
            <h1 class="text-3xl font-bold mb-2">{{ event()?.name }}</h1>
            
            <p class="text-gray-700 mb-6">{{ event()?.description }}</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                <span>{{ formatEventDate(event()!.startDate, event()!.endDate) }}</span>
              </div>
               <div class="flex items-center">
                <svg class="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{{ event()?.location }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>
                <span class="font-bold text-lg">{{ event()!.price > 0 ? event()!.price + '€' : 'Grátis' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">Evento não encontrado.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);

  event = signal<Event | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.event.set(this.activityService.getEventById(id) ?? null);
    }
  }

  formatEventDate(startDateString: string, endDateString: string): string {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString('pt-PT', options);
    } else {
      return `${startDate.toLocaleDateString('pt-PT', options)} - ${endDate.toLocaleDateString('pt-PT', options)}`;
    }
  }
}
