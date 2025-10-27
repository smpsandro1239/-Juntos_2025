import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface WeatherData {
  temperature: number;
  weathercode: number;
  is_day: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // In a real app, this would use HttpClient to fetch from a weather API
  // e.g., https://api.open-meteo.com/v1/forecast?latitude=38.7259&longitude=-9.1374&current=temperature_2m,is_day,weather_code
  getWeather(city: string): Observable<WeatherData> {
    // Mock data for Lisbon
    const mockData: WeatherData = {
      temperature: 22.5,
      weathercode: 3, // Partly cloudy
      is_day: 1,
    };
    
    // Simulate network delay
    return of(mockData).pipe(delay(500));
  }
}
