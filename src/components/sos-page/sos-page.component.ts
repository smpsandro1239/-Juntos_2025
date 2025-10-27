import { Component, ChangeDetectionStrategy, inject, Signal, computed } from '@angular/core';
import { EmergencyService } from '../../services/emergency.service';
import { EmergencyLocation } from '../../models/emergency-location.model';
import { RouterLink } from '@angular/router';

interface MapBounds {
  minLat: number; maxLat: number; minLng: number; maxLng: number;
}

@Component({
  selector: 'app-sos-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-extrabold text-red-600">Emergência SOS</h2>
        <p class="text-lg text-gray-600 mt-2">Acesso rápido a números e locais importantes.</p>
        <p class="text-sm text-gray-500 mt-1">Se estiver numa emergência grave, ligue imediatamente para o 112.</p>
      </div>

      <!-- Emergency Numbers -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <a href="tel:112" class="block bg-red-100 p-6 rounded-lg shadow-md text-center hover:bg-red-200 transition-colors">
          <p class="text-5xl">🚨</p>
          <p class="text-xl font-bold text-red-800 mt-2">Ligar 112</p>
          <p class="text-red-700">Número Nacional de Emergência</p>
        </a>
        <a href="tel:808242424" class="block bg-blue-100 p-6 rounded-lg shadow-md text-center hover:bg-blue-200 transition-colors">
          <p class="text-5xl">👩‍⚕️</p>
          <p class="text-xl font-bold text-blue-800 mt-2">Ligar Saúde 24</p>
          <p class="text-blue-700">Aconselhamento de Saúde</p>
        </a>
        <a href="tel:116000" class="block bg-yellow-100 p-6 rounded-lg shadow-md text-center hover:bg-yellow-200 transition-colors">
          <p class="text-5xl">🧒</p>
          <p class="text-xl font-bold text-yellow-800 mt-2">Crianças Desaparecidas</p>
          <p class="text-yellow-700">Linha de Apoio</p>
        </a>
      </div>

      <!-- Locations -->
      <div>
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Locais de Emergência Próximos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- List -->
          <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            @for(location of locations(); track location.id) {
              <div class="bg-white p-4 rounded-lg shadow-md flex items-start gap-4"
                   [class.border-l-4]="true"
                   [class.border-blue-500]="location.type === 'hospital'"
                   [class.border-green-500]="location.type === 'pharmacy'"
                   [class.border-gray-500]="location.type === 'police'">
                <div class="text-3xl pt-1">
                  {{ getLocationIcon(location.type) }}
                </div>
                <div>
                  <p class="font-bold text-lg">{{ location.name }}</p>
                  <p class="text-sm text-gray-600">{{ location.address }}</p>
                  <a [href]="'tel:' + location.phone" class="text-sm text-teal-600 hover:underline">Ligar: {{ location.phone }}</a>
                </div>
              </div>
            }
          </div>

          <!-- Map -->
          <div class="bg-gray-200 rounded-lg shadow-inner relative h-96 md:h-auto overflow-hidden">
            <img src="https://maps.googleapis.com/maps/api/staticmap?center=Lisbon,Portugal&zoom=12&size=600x600&maptype=roadmap&key=${process.env.API_KEY}" alt="Mapa de Lisboa" class="absolute inset-0 w-full h-full object-cover opacity-50"/>
             @for(location of locations(); track location.id) {
              <div class="absolute transform -translate-x-1/2 -translate-y-full transition-transform duration-300" 
                  [style.top]="getPosition(location).top"
                  [style.left]="getPosition(location).left">
                   <div class="relative flex flex-col items-center group">
                      <span class="text-3xl cursor-pointer">{{ getLocationIcon(location.type) }}</span>
                      <div class="absolute bottom-0 flex flex-col items-center hidden mb-8 group-hover:flex w-48">
                          <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded-md text-center">{{ location.name }}</span>
                          <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                      </div>
                  </div>
              </div>
            }
          </div>

        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SosPageComponent {
  private emergencyService = inject(EmergencyService);
  
  locations: Signal<EmergencyLocation[]> = this.emergencyService.allLocations;

  private bounds = computed<MapBounds | null>(() => {
    const currentLocations = this.locations();
    if (currentLocations.length === 0) return null;

    const lats = currentLocations.map(a => a.location.lat);
    const lngs = currentLocations.map(a => a.location.lng);

    return {
      minLat: Math.min(...lats), maxLat: Math.max(...lats),
      minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
    };
  });

  getPosition(location: EmergencyLocation): { top: string; left: string } {
    const b = this.bounds();
    if (!b) return { top: '50%', left: '50%' };

    const latRange = b.maxLat - b.minLat;
    const lngRange = b.maxLng - b.minLng;
    
    const padding = 0.1; 
    const effectiveLatRange = latRange === 0 ? 1 : latRange * (1 + 2 * padding);
    const effectiveLngRange = lngRange === 0 ? 1 : lngRange * (1 + 2 * padding);
    const minLatPadded = b.minLat - (latRange * padding);
    const minLngPadded = b.minLng - (lngRange * padding);
    
    const top = 100 - ((location.location.lat - minLatPadded) / effectiveLatRange) * 100;
    const left = ((location.location.lng - minLngPadded) / effectiveLngRange) * 100;

    return { top: `${top}%`, left: `${left}%` };
  }
  
  getLocationIcon(type: EmergencyLocation['type']): string {
    switch(type) {
      case 'hospital': return '🏥';
      case 'pharmacy': return '⚕️';
      case 'police': return '🚓';
    }
  }
}
