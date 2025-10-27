import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }

  getWeather(location: string): Observable<WeatherData> {
    // In a real app, this would make an HTTP request to a weather API
    const mockWeather: WeatherData = {
      location: location,
      temperature: 24,
      condition: 'partly-cloudy',
      icon: '⛅'
    };

    return of(mockWeather).pipe(delay(500)); // Simulate network delay
  }
}
