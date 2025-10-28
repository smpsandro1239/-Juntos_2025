
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { FiltersComponent, ActivityFilters } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FiltersComponent, DiscoverFeedComponent, L10nPipe, EventCarouselComponent, WeatherWidgetComponent],
  template: `
    <div class="space-y-8">
      <header class="text-center py-8 bg-teal-500 text-white rounded-lg shadow-md">
        <h1 class="text-4xl font-extrabold">{{ 'welcomeTitle' | l10n }}</h1>
        <p class="mt-2 text-lg">{{ 'welcomeSubtitle' | l10n }}</p>
      </header>

      <app-weather-widget location="Lisboa" />

      <section>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'upcomingEvents' | l10n }}</h2>
        <app-event-carousel [events]="events()" />
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'discoverActivities' | l10n }}</h2>
        <app-filters 
          [allCategories]="allCategories()"
          [maxPrice]="maxPrice()"
          [filters]="filters()"
          (filtersChanged)="onFiltersChanged($event)" 
        />
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

  filters = signal<ActivityFilters>({
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 100,
    minRating: 0
  });

  allCategories = computed(() => [...new Set(this.allActivities().map(a => a.category))]);
  maxPrice = computed(() => Math.max(...this.allActivities().map(a => a.price), 100));

  filteredActivities = computed(() => {
    const activities = this.allActivities();
    const filters = this.filters();

    return activities.filter(activity => {
      const searchMatch = filters.search 
        ? activity.name.toLowerCase().includes(filters.search.toLowerCase()) || activity.description.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const categoryMatch = filters.category === 'all' || activity.category === filters.category;
      const priceMatch = activity.price <= filters.maxPrice;
      const ratingMatch = activity.rating >= filters.minRating;
      
      return searchMatch && categoryMatch && priceMatch && ratingMatch;
    });
  });

  onFiltersChanged(newFilters: ActivityFilters): void {
    this.filters.set(newFilters);
  }
}
