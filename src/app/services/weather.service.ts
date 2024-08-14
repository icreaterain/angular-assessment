import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '794ee95e63c5a32aaf88cd813fa2e425';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeatherData(
    countryName: string,
    units: 'metric' | 'imperial' = 'metric'
  ): Observable<WeatherResponse> {
    const url = `${this.apiUrl}?q=${countryName}&units=${units}&APPID=${this.apiKey}`;
    return this.http.get<WeatherResponse>(url);
  }
}
