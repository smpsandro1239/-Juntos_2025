import { Component, ChangeDetectionStrategy, input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule, L10nPipe],
  template: `
    <div class="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
      <h3 class="font-bold text-lg mb-2 text-blue-800">{{ 'weatherIn' | l10n }} {{ location() }}</h3>
      @if (weather()) {
        @let w = weather()!;
        <div class="flex items-center space-x-4">
          <div class="text-4xl">
            @switch (w.condition) {
              @case ('Sunny') { ☀️ }
              @case ('Cloudy') { ☁️ }
              @case ('Rainy') { 🌧️ }
              @case ('Partly Cloudy') { ⛅ }
            }
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-900">{{ w.temperature }}°C</p>
            <p class="text-blue-700">{{ w.condition }}</p>
          </div>
        </div>
      } @else {
        <p class="text-blue-700">{{ 'loadingWeather' | l10n }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidgetComponent implements OnInit {
  location = input.required<string>();
  private weatherService = inject(WeatherService);
  weather = signal<WeatherData | null>(null);

  ngOnInit(): void {
    this.weatherService.getWeather(this.location()).subscribe(data => {
      this.weather.set(data);
    });
  }
}
