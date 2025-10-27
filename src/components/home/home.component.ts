import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { FiltersComponent } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { EventCarouselComponent } from '../event-carousel/event-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FiltersComponent,
    DiscoverFeedComponent,
    MapViewComponent,
    EventCarouselComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  viewMode = signal<'list' | 'map'>('list');

  setViewMode(mode: 'list' | 'map'): void {
    this.viewMode.set(mode);
  }
}
