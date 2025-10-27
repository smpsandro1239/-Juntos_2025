import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivityService, ActivityFilters } from '../../services/activity.service';
import { FiltersComponent } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FiltersComponent,
    DiscoverFeedComponent,
    EventCarouselComponent,
    WeatherWidgetComponent,
    L10nPipe
  ],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside class="lg:col-span-1">
        <div class="sticky top-24 space-y-6">
            <app-filters (filtersChanged)="onFiltersChanged($event)" />
            <app-weather-widget location="Lisbon" />
        </div>
      </aside>

      <div class="lg:col-span-3">
        <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ 'upcomingEvents' | l10n }}</h2>
            <app-event-carousel [events]="upcomingEvents()" />
        </section>

        <section>
            <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ 'discoverActivities' | l10n }}</h2>
            <app-discover-feed [activities]="filteredActivities()" />
        </section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private activityService = inject(ActivityService);
  
  filteredActivities = this.activityService.filteredActivities;
  upcomingEvents = this.activityService.upcomingEvents;

  onFiltersChanged(filters: ActivityFilters): void {
    this.activityService.applyFilters(filters);
  }
}
