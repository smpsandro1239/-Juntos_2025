import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md text-center">
      <h3 class="font-semibold text-gray-700">Tempo em {{ location() }}</h3>
      @if (weather(); as data) {
        <div class="flex items-center justify-center mt-2">
            <span class="text-5xl">{{ data.icon }}</span>
            <div class="ml-4 text-left">
                <p class="text-3xl font-bold text-gray-800">{{ data.temperature }}°C</p>
                <p class="text-gray-500 capitalize">{{ getConditionText(data.condition) }}</p>
            </div>
        </div>
      } @else {
        <div class="h-16 flex items-center justify-center">
            <p class="text-gray-500">A carregar tempo...</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidgetComponent {
  location = input.required<string>();
  
  private weatherService = inject(WeatherService);
  private location$ = toObservable(this.location);

  weather = toSignal(
    this.location$.pipe(
      switchMap(location => this.weatherService.getWeather(location))
    )
  );

  getConditionText(condition: WeatherData['condition']): string {
    switch(condition) {
      case 'sunny': return 'Ensolarado';
      case 'cloudy': return 'Nublado';
      case 'rainy': return 'Chuvoso';
      case 'partly-cloudy': return 'Parcialmente Nublado';
      default: return '';
    }
  }
}