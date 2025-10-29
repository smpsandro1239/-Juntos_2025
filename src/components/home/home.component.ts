import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { WeatherService } from '../../services/weather.service';
import { FiltersComponent } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FiltersComponent, DiscoverFeedComponent, MapViewComponent, EventCarouselComponent, WeatherWidgetComponent, L10nPipe],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private activityService = inject(ActivityService);
  private weatherService = inject(WeatherService);

  filteredActivities = this.activityService.filteredActivities;
  upcomingEvents = this.activityService.upcomingEvents;
  weather = signal<any>(null); // toSignal can be used here in a real app
  
  viewMode = signal<'list' | 'map'>('list');

  constructor() {
     this.weatherService.getWeather('Lisboa').subscribe(data => this.weather.set(data));
  }

  isRainy(): boolean {
    return this.weather()?.condition === 'Rainy';
  }

  isUvHigh(): boolean {
      return this.weather()?.uvIndex >= 6;
  }
  
  activateRainyFilter(): void {
    this.activityService.showRainyDayOk.set(true);
  }
}
