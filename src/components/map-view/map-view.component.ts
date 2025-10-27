import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-map-view',
  standalone: true,
  template: `
    <div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
      <p class="text-gray-500">Map placeholder</p>
      <!-- In a real app, this would be a Google Maps, Leaflet, or other map implementation -->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent {
  locations = input.required<{lat: number, lng: number, name: string}[]>();
}
