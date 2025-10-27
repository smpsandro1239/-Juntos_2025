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
    WeatherWidgetComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="my-8 text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span class="block text-teal-600">+JUNTOS</span>
              <span class="block text-gray-600">A sua aventura em família começa aqui.</span>
          </h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Descubra as melhores atividades, eventos e locais para criar memórias inesquecíveis.
          </p>
      </div>

      <app-weather-widget></app-weather-widget>

      <div class="my-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Eventos em Destaque</h2>
        <app-event-carousel></app-event-carousel>
      </div>

      <app-filters></app-filters>

      <div class="flex justify-end mb-4">
        <div class="inline-flex rounded-md shadow-sm">
          <button 
            (click)="viewMode.set('list')"
            [class]="viewMode() === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            class="px-4 py-2 text-sm font-medium rounded-l-md border border-gray-200 focus:z-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            Lista
          </button>
          <button 
            (click)="viewMode.set('map')"
            [class]="viewMode() === 'map' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            class="-ml-px px-4 py-2 text-sm font-medium rounded-r-md border border-gray-200 focus:z-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            Mapa
          </button>
        </div>
      </div>

      @if (viewMode() === 'list') {
        <app-discover-feed></app-discover-feed>
      } @else {
        <app-map-view></app-map-view>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  viewMode = signal<'list' | 'map'>('list');
}
