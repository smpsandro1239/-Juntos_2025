import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { FiltersComponent } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FiltersComponent, DiscoverFeedComponent, EventCarouselComponent, L10nPipe, WeatherWidgetComponent],
  template: `
    <div class="space-y-8">
      <header class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-800">{{ 'welcomeTitle' | l10n }}</h1>
        <p class="mt-2 text-lg text-gray-600">{{ 'welcomeSubtitle' | l10n }}</p>
      </header>
      
      <app-filters (filtersChanged)="onFiltersChanged($event)" />

      <app-weather-widget location="Lisboa" class="my-6" />

      <section>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">{{ 'upcomingEvents' | l10n }}</h2>
        <app-event-carousel [events]="events()" />
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">{{ 'discoverActivities' | l10n }}</h2>
        <app-discover-feed [activities]="filteredActivities()" />
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private activityService = inject(ActivityService);
  
  allActivities = this.activityService.allActivities;
  events = this.activityService.allEvents;

  private activeFilters = signal<{searchTerm: string, category: string, price: string}>({
      searchTerm: '',
      category: 'all',
      price: 'all'
  });

  filteredActivities = computed(() => {
    let activities = this.allActivities();
    const filters = this.activeFilters();

    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      activities = activities.filter(a => 
        a.name.toLowerCase().includes(searchTermLower) ||
        a.description.toLowerCase().includes(searchTermLower)
      );
    }
    if (filters.category && filters.category !== 'all') {
      activities = activities.filter(a => a.category === filters.category);
    }
    if (filters.price) {
      if (filters.price === 'free') {
        activities = activities.filter(a => a.price === 0);
      } else if (filters.price === 'paid') {
        activities = activities.filter(a => a.price > 0);
      }
    }
    return activities;
  });

  onFiltersChanged(filters: {searchTerm: string, category: string, price: string}): void {
    this.activeFilters.set(filters);
  }
}
