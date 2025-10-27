import { Component, ChangeDetectionStrategy, inject, input, signal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [AsyncPipe],
  host: {
    class: 'block'
  },
  template: `
    <div class="bg-white p-4 rounded-lg shadow">
        @if(weatherData$ | async; as weather) {
            <div class="flex items-center">
                <div class="text-4xl">{{ weather.icon }}</div>
                <div class="ml-4">
                    <p class="font-bold text-xl">{{ weather.temperature }}°C</p>
                    <p class="text-gray-600">{{ weather.location }}</p>
                </div>
            </div>
        } @else {
            <p>A carregar meteorologia...</p>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidgetComponent implements OnInit {
    location = input.required<string>();
    private weatherService = inject(WeatherService);
    
    weatherData$!: Observable<WeatherData>;

    ngOnInit(): void {
        this.weatherData$ = this.weatherService.getWeather(this.location());
    }
}
