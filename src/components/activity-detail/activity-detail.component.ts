import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './activity-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private activityService = inject(ActivityService);
  private route = inject(ActivatedRoute);
  
  // Obtém o 'id' da rota como um signal de forma reativa
  private readonly id: Signal<number | undefined> = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        return id ? Number(id) : undefined;
      })
    )
  );

  activity: Signal<Activity | undefined> = this.activityService.getActivityById(this.id);
  
  onToggleFavorite(event: MouseEvent, id: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.activityService.toggleFavorite(id);
  }
}
