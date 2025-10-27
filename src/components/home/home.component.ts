import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FiltersComponent } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FiltersComponent,
    DiscoverFeedComponent,
    MapViewComponent,
    EventCarouselComponent,
    WeatherWidgetComponent
  ],
  template: `
    <div class="space-y-12">
      <!-- Header Section -->
      <section class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Descubra Aventuras em Família</h1>
        <p class="text-lg text-gray-600">As melhores atividades e eventos para criar memórias inesquecíveis.</p>
      </section>

      <!-- Weather and Filters -->
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="w-full md:w-3/4">
          <app-filters />
        </div>
        <div class="w-full md:w-1/4">
           <app-weather-widget location="Lisboa" />
        </div>
      </div>

      <!-- Events Carousel -->
      <section>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Eventos Especiais</h2>
          <app-event-carousel />
      </section>

      <!-- Main Content: Feed or Map -->
      <section>
        <div class="flex justify-center border-b mb-6">
            <button (click)="viewMode.set('feed')" class="px-6 py-2 font-semibold" [class]="viewMode() === 'feed' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'">
                Lista
            </button>
            <button (click)="viewMode.set('map')" class="px-6 py-2 font-semibold" [class]="viewMode() === 'map' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'">
                Mapa
            </button>
        </div>

        @if (viewMode() === 'feed') {
          <app-discover-feed />
        } @else {
          <app-map-view />
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  viewMode = signal<'feed' | 'map'>('feed');
}
