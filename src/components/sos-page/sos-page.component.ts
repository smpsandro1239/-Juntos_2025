import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { EmergencyService } from '../../services/emergency.service';
import { EmergencyLocation } from '../../models/emergency-location.model';
import { MapViewComponent } from '../map-view/map-view.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-sos-page',
  standalone: true,
  imports: [MapViewComponent, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-red-600 mb-2">{{ 'sosTitle' | l10n }}</h1>
      <p class="text-gray-600 mb-8">{{ 'sosDescription' | l10n }}</p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Locations List -->
        <div class="lg:col-span-2 space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4 flex items-center"><span class="text-3xl mr-3">🏥</span> {{ 'hospitals' | l10n }}</h2>
            <div class="space-y-3">
              @for(location of hospitals(); track location.id) {
                <div class="bg-gray-50 p-4 rounded-md border">
                  <h3 class="font-bold">{{ location.name }}</h3>
                  <p class="text-sm text-gray-600">{{ location.address }}</p>
                  <a [href]="'tel:' + location.phone" class="text-teal-600 hover:underline">{{ location.phone }}</a>
                </div>
              }
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4 flex items-center"><span class="text-3xl mr-3">💊</span> {{ 'pharmacies' | l10n }}</h2>
             <div class="space-y-3">
              @for(location of pharmacies(); track location.id) {
                <div class="bg-gray-50 p-4 rounded-md border">
                  <h3 class="font-bold">{{ location.name }}</h3>
                  <p class="text-sm text-gray-600">{{ location.address }}</p>
                  <a [href]="'tel:' + location.phone" class="text-teal-600 hover:underline">{{ location.phone }}</a>
                </div>
              }
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4 flex items-center"><span class="text-3xl mr-3">🚓</span> {{ 'police' | l10n }}</h2>
             <div class="space-y-3">
              @for(location of police(); track location.id) {
                <div class="bg-gray-50 p-4 rounded-md border">
                  <h3 class="font-bold">{{ location.name }}</h3>
                  <p class="text-sm text-gray-600">{{ location.address }}</p>
                  <a [href]="'tel:' + location.phone" class="text-teal-600 hover:underline">{{ location.phone }}</a>
                </div>
              }
            </div>
          </section>
        </div>
        <!-- Map -->
        <aside class="sticky top-24 h-96">
            <app-map-view [locations]="mapLocations()" />
        </aside>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SosPageComponent {
    private emergencyService = inject(EmergencyService);
    locations = this.emergencyService.allLocations;
    
    hospitals = computed(() => this.locations().filter(l => l.type === 'hospital'));
    pharmacies = computed(() => this.locations().filter(l => l.type === 'pharmacy'));
    police = computed(() => this.locations().filter(l => l.type === 'police'));

    mapLocations = computed(() => {
        return this.locations().map(l => ({
            lat: l.location.lat,
            lng: l.location.lng,
            name: l.name
        }));
    });
}
