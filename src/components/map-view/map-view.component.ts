import { Component, ChangeDetectionStrategy, computed, inject, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

interface MapBounds {
  minLat: number; maxLat: number; minLng: number; maxLng: number;
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './map-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent {
  private activityService = inject(ActivityService);
  
  activities: Signal<Activity[]> = this.activityService.filteredActivities;
  activeActivityId = signal<number | null>(null);

  // Calcula os limites geográficos das atividades visíveis para ajustar o "zoom" do mapa
  private bounds = computed<MapBounds | null>(() => {
    const currentActivities = this.activities();
    if (currentActivities.length === 0) return null;

    const lats = currentActivities.map(a => a.location.lat);
    const lngs = currentActivities.map(a => a.location.lng);

    return {
      minLat: Math.min(...lats), maxLat: Math.max(...lats),
      minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
    };
  });

  // Converte coordenadas geográficas em posições percentuais para o CSS
  getPosition(activity: Activity): { top: string; left: string } {
    const b = this.bounds();
    if (!b) return { top: '50%', left: '50%' };

    const latRange = b.maxLat - b.minLat;
    const lngRange = b.maxLng - b.minLng;

    // Adiciona um pequeno padding para os marcadores não ficarem nas bordas
    const padding = 0.1; 
    const effectiveLatRange = latRange === 0 ? 1 : latRange * (1 + 2 * padding);
    const effectiveLngRange = lngRange === 0 ? 1 : lngRange * (1 + 2 * padding);
    const minLatPadded = b.minLat - (latRange * padding);
    const minLngPadded = b.minLng - (lngRange * padding);
    
    const top = 100 - ((activity.location.lat - minLatPadded) / effectiveLatRange) * 100;
    const left = ((activity.location.lng - minLngPadded) / effectiveLngRange) * 100;

    return { top: `${top}%`, left: `${left}%` };
  }
}
