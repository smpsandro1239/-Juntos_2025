import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmergencyService } from '../../services/emergency.service';
import { MapViewComponent } from '../map-view/map-view.component';
import { EmergencyLocation } from '../../models/emergency-location.model';

@Component({
  selector: 'app-sos-page',
  standalone: true,
  imports: [CommonModule, MapViewComponent],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-red-600 mb-2">Página de Emergência (SOS)</h1>
        <p class="text-gray-600">Contactos e locais úteis em caso de emergência. Em caso de perigo imediato, ligue 112.</p>
        <a href="tel:112" class="mt-4 inline-block bg-red-600 text-white text-2xl font-bold py-4 px-8 rounded-full hover:bg-red-700">
            Ligar 112
        </a>
      </div>

      <div class="mb-6 flex justify-center space-x-2 border-b">
         @for (type of locationTypes; track type) {
          <button 
            (click)="selectedType.set(type.id)"
            class="py-2 px-4 -mb-px"
            [class.border-b-2]="selectedType() === type.id"
            [class.border-red-500]="selectedType() === type.id"
            [class.text-red-600]="selectedType() === type.id"
            [class.text-gray-500]="selectedType() !== type.id">
            {{ type.label }}
          </button>
        }
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          @for(location of filteredLocations(); track location.id) {
            <div class="border-b p-4 hover:bg-gray-50">
                <h3 class="font-bold text-lg">{{ location.name }}</h3>
                <p class="text-gray-700">{{ location.address }}</p>
                <a [href]="'tel:'+location.phone" class="text-teal-500 hover:underline">{{ location.phone }}</a>
            </div>
          }
        </div>
        <div>
          <app-map-view [locations]="mapLocations()" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SosPageComponent {
    private emergencyService = inject(EmergencyService);
    
    locations = this.emergencyService.allLocations;
    selectedType = signal<'hospital' | 'pharmacy' | 'police'>('hospital');
    
    locationTypes: {id: 'hospital' | 'pharmacy' | 'police', label: string}[] = [
        { id: 'hospital', label: 'Hospitais' },
        { id: 'pharmacy', label: 'Farmácias' },
        { id: 'police', label: 'Polícia' },
    ];
    
    filteredLocations = computed(() => {
        return this.locations().filter(loc => loc.type === this.selectedType());
    });

    mapLocations = computed(() => {
        return this.filteredLocations().map(loc => ({
            lat: loc.location.lat,
            lng: loc.location.lng,
            name: loc.name
        }));
    });
}
