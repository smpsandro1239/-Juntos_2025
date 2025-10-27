import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

export interface WeatherData {
  location: string;
  temperature: number; // Celsius
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Partly Cloudy';
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // This is a mock service. In a real app, this would make an HTTP request.
  getWeather(location: string) {
    const mockData: WeatherData = {
      location: location,
      temperature: 24,
      condition: 'Sunny'
    };

    // Simulate network delay
    return of(mockData).pipe(delay(500));
  }
}
