import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FiltersComponent } from '../filters/filters.component';
import { DiscoverFeedComponent } from '../discover-feed/discover-feed.component';
import { MapViewComponent } from '../map-view/map-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FiltersComponent, DiscoverFeedComponent, MapViewComponent]
})
export class HomeComponent {
  viewMode = signal<'list' | 'map'>('list');
}
