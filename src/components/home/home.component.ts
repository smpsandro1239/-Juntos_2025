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
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-4xl font-bold text-teal-600">Descubra Aventuras em Família</h1>
        <p class="text-gray-600 mt-2">Atividades, eventos e fornecedores para momentos inesquecíveis.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
            <!-- Events Carousel -->
            <div class="mb-8">
                <h2 class="text-2xl font-bold mb-4">Eventos Próximos</h2>
                <app-event-carousel></app-event-carousel>
            </div>
        </div>
        <div class="lg:col-span-1">
          <h2 class="text-2xl font-bold mb-4">Planeie o seu dia</h2>
          <app-weather-widget location="Lisboa"></app-weather-widget>
        </div>
      </div>
      
      <!-- Filters -->
      <app-filters></app-filters>

      <!-- View Toggle -->
      <div class="flex justify-end items-center gap-4">
        <span class="text-sm font-medium text-gray-700">Visualizar como:</span>
        <div class="inline-flex rounded-md shadow-sm">
          <button
            (click)="viewMode.set('list')"
            [class]="viewMode() === 'list' ? 'bg-teal-500 text-white' : 'bg-white text-gray-500'"
            class="px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-teal-500 transition-colors">
            Lista
          </button>
          <button
            (click)="viewMode.set('map')"
            [class]="viewMode() === 'map' ? 'bg-teal-500 text-white' : 'bg-white text-gray-500'"
            class="px-4 py-2 text-sm font-medium rounded-r-lg border-t border-b border-r border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-teal-500 transition-colors">
            Mapa
          </button>
        </div>
      </div>

      <!-- Content -->
      <div>
        @if (viewMode() === 'list') {
          <app-discover-feed></app-discover-feed>
        } @else {
          <app-map-view></app-map-view>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  viewMode = signal<'list' | 'map'>('list');
}
