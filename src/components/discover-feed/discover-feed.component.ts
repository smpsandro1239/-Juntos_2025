import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-discover-feed',
  standalone: true,
  templateUrl: './discover-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class DiscoverFeedComponent {
  private activityService = inject(ActivityService);
  
  activities: Signal<Activity[]> = this.activityService.filteredActivities;

  onToggleFavorite(event: MouseEvent, id: number): void {
    event.preventDefault(); // Impede a navegação do link <a> pai
    event.stopPropagation(); // Impede que o evento se propague
    this.activityService.toggleFavorite(id);
  }
}
