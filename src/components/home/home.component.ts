import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivityService, ActivityFilters } from '../../services/activity.service';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { FiltersComponent } from '../filters/filters.component';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    DiscoverFeedComponent,
    FiltersComponent,
    EventCarouselComponent,
    WeatherWidgetComponent,
    L10nPipe
  ],
  template: `
    <section class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ 'homeTitle' | l10n }}</h1>
      <p class="text-gray-600">As melhores atividades e eventos para crianças em Lisboa e arredores.</p>
    </section>

    <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'upcomingEvents' | l10n }}</h2>
        <app-event-carousel [events]="activityService.upcomingEvents()" />
    </section>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside class="md:col-span-1">
        <app-filters (filtersChanged)="onFiltersChanged($event)" />
        <app-weather-widget location="Lisbon" class="mt-8" />
      </aside>
      <main class="md:col-span-3">
        <app-discover-feed [activities]="activityService.filteredActivities()" />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  activityService = inject(ActivityService);

  onFiltersChanged(filters: ActivityFilters): void {
    this.activityService.applyFilters(filters);
  }
}
