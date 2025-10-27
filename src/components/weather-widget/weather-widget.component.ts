import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg shadow-lg text-white mb-8">
      @if (weather$ | async; as weather) {
        <div class="flex justify-between items-center">
          <div>
            <p class="text-lg font-semibold">Tempo em Lisboa</p>
            <p class="text-3xl font-bold">{{ weather.temperature.toFixed(1) }}°C</p>
          </div>
          <div class="text-right">
            <span class="text-5xl">{{ getWeatherIcon(weather.weathercode, weather.is_day) }}</span>
            <p>{{ getWeatherDescription(weather.weathercode) }}</p>
          </div>
        </div>
      } @else if (error()) {
        <p>Não foi possível carregar a meteorologia.</p>
      } @else {
        <p>A carregar meteorologia...</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidgetComponent implements OnInit {
  private weatherService = inject(WeatherService);
  
  weather$!: Observable<WeatherData | null>;
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.weather$ = this.weatherService.getWeather('Lisboa').pipe(
      catchError(err => {
        console.error('Error fetching weather', err);
        this.error.set('Failed to load weather data.');
        return of(null);
      })
    );
  }

  getWeatherIcon(code: number, isDay: number): string {
    const isDayTime = isDay === 1;
    switch (code) {
      case 0: return isDayTime ? '☀️' : '🌙'; // Clear sky
      case 1: 
      case 2: 
      case 3: return isDayTime ? '⛅' : '☁️'; // Mainly clear, partly cloudy, overcast
      case 45: 
      case 48: return '🌫️'; // Fog
      case 51: 
      case 53: 
      case 55: return '🌧️'; // Drizzle
      case 61: 
      case 63: 
      case 65: return '🌧️'; // Rain
      case 80: 
      case 81: 
      case 82: return '🌦️'; // Rain showers
      case 95: return '⛈️'; // Thunderstorm
      default: return '🌡️';
    }
  }

  getWeatherDescription(code: number): string {
    switch (code) {
      case 0: return 'Céu limpo';
      case 1: return 'Maioritariamente limpo';
      case 2: return 'Parcialmente nublado';
      case 3: return 'Nublado';
      case 45:
      case 48: return 'Nevoeiro';
      case 51: 
      case 53: 
      case 55: return 'Chuviscos';
      case 61: 
      case 63: 
      case 65: return 'Chuva';
      case 80: 
      case 81: 
      case 82: return 'Aguaceiros';
      case 95: return 'Trovoada';
      default: return 'Desconhecido';
    }
  }
}
