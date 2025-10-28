import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

export type AirQualityLevel = 'Good' | 'Moderate' | 'Poor';

export interface WeatherData {
  location: string;
  temperature: number; // Celsius
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Partly Cloudy';
  uvIndex: number; // 0-11+
  airQuality: {
    level: AirQualityLevel;
    value: number; // AQI value
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // This is a mock service. In a real app, this would make an HTTP request.
  getWeather(location: string) {
    // Cycle through different weather conditions for demonstration
    const conditions: WeatherData['condition'][] = ['Sunny', 'Rainy', 'Partly Cloudy'];
    const currentCondition = conditions[new Date().getMinutes() % conditions.length];

    let mockData: WeatherData;

    if (currentCondition === 'Sunny') {
      mockData = {
        location: location,
        temperature: 28,
        condition: 'Sunny',
        uvIndex: 8,
        airQuality: { level: 'Moderate', value: 75 }
      };
    } else if (currentCondition === 'Rainy') {
       mockData = {
        location: location,
        temperature: 18,
        condition: 'Rainy',
        uvIndex: 1,
        airQuality: { level: 'Good', value: 25 }
      };
    } else {
       mockData = {
        location: location,
        temperature: 22,
        condition: 'Partly Cloudy',
        uvIndex: 5,
        airQuality: { level: 'Good', value: 45 }
      };
    }

    // Simulate network delay
    return of(mockData).pipe(delay(500));
  }
}
