import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from '../map-view/map-view.component';
import { EmergencyService } from '../../services/emergency.service';
import { EmergencyLocation } from '../../models/emergency-location.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-sos-page',
  standalone: true,
  imports: [CommonModule, MapViewComponent, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-red-600">{{ 'sosTitle' | l10n }}</h1>
        <p class="text-gray-600 mt-2">{{ 'sosSubtitle' | l10n }}</p>
      </div>

      <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-r-lg mb-8 text-center">
        <h2 class="text-2xl font-bold">{{ 'emergencyNumber' | l10n }}: 112</h2>
        <a href="tel:112" class="mt-4 inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
          {{ 'callNow' | l10n }}
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div class="flex space-x-2 mb-4 border-b pb-2">
            @for(type of filterTypes; track type.id) {
              <button 
                (click)="selectedType.set(type.id)"
                class="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                [class.bg-teal-500]="selectedType() === type.id"
                [class.text-white]="selectedType() === type.id"
                [class.hover:bg-teal-100]="selectedType() !== type.id"
              >
                {{ type.label | l10n }}
              </button>
            }
          </div>
          <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
            @for(location of filteredLocations(); track location.id) {
              <div class="p-4 border rounded-lg bg-gray-50">
                <h3 class="font-bold text-gray-800">{{ location.name }}</h3>
                <p class="text-sm text-gray-600">{{ location.address }}</p>
                <a [href]="'tel:' + location.phone" class="text-sm text-teal-600 hover:underline">{{ location.phone }}</a>
              </div>
            }
          </div>
        </div>
        <div>
          <app-map-view [locations]="filteredLocations()" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SosPageComponent {
  private emergencyService = inject(EmergencyService);

  filterTypes: {id: EmergencyLocation['type'], label: string}[] = [
    { id: 'Hospital', label: 'hospitals' },
    { id: 'Police', label: 'policeStations' },
    { id: 'Pharmacy', label: 'pharmacies' }
  ];
  
  selectedType = signal<EmergencyLocation['type']>('Hospital');
  
  allLocations = this.emergencyService.allLocations;

  filteredLocations = computed(() => {
    const type = this.selectedType();
    return this.allLocations().filter(loc => loc.type === type);
  });
}
