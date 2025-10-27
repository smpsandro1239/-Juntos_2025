import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, L10nPipe],
  template: `
    <div class="relative w-full h-full min-h-64 bg-slate-200 rounded-lg shadow-inner overflow-hidden border-2 border-white">
      <!-- Simulated map background -->
      <img src="https://picsum.photos/seed/mapbg/800/600" class="absolute inset-0 w-full h-full object-cover opacity-20"/>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-200/30 to-transparent"></div>

      @for (location of locations(); track location.name; let i = $index) {
        <div class="absolute group" 
             [style.top.%]="getPosition(location, i).top" 
             [style.left.%]="getPosition(location, i).left"
             (mouseenter)="activeLocationName.set(location.name)"
             (mouseleave)="activeLocationName.set(null)">

          <!-- Pop-up -->
          <div
             class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-40 bg-white rounded-lg shadow-xl p-2 text-center text-xs transition-all duration-200 origin-bottom z-20"
             [class]="activeLocationName() === location.name ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'">
              <p class="font-bold text-slate-800 truncate">{{ location.name }}</p>
          </div>

          <!-- Pin -->
           <div 
              class="block w-5 h-5 rounded-full bg-teal-500 border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2
                     flex items-center justify-center relative z-10 transition-transform duration-200"
              [class]="activeLocationName() === location.name ? 'scale-125 bg-red-500' : 'group-hover:scale-125'">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
           </div>
        </div>
      } @empty {
         <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg">
                <p class="mt-1 text-slate-500 text-sm">{{ 'noLocationsMap' | l10n }}</p>
            </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent {
  locations = input.required<{lat: number, lng: number, name: string}[]>();
  activeLocationName = signal<string | null>(null);

  // This is a simple hashing function to create a pseudo-random but deterministic position
  // for each location on the map placeholder.
  getPosition(location: {lat: number, lng: number, name: string}, index: number): { top: number, left: number } {
    const latFactor = Math.abs(Math.sin(location.lat * 1000) * 100);
    const lngFactor = Math.abs(Math.cos(location.lng * 1000) * 100);
    
    // Spread them out a bit using index to avoid perfect collisions
    const top = (latFactor + index * 5) % 80 + 10; // between 10% and 90%
    const left = (lngFactor + index * 5) % 80 + 10; // between 10% and 90%

    return { top, left };
  }
}