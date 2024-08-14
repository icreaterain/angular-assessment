import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WeatherService } from '../services/weather.service';
import { WeatherResponse } from '../models/weather.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
})
export class WeatherComponent implements OnInit {
  countryName!: string | null;
  weatherData: WeatherResponse | null = null;
  units: 'metric' | 'imperial' = 'metric';
  error: string | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('countryName');
    if (this.countryName) {
      this.fetchWeatherData(this.countryName);
    }
  }

  fetchWeatherData(countryName: string): void {
    this.isLoading = true;
    this.weatherService.getWeatherData(countryName, this.units).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.error = null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching weather data', err);
        this.error = 'Failed to load weather data. Please try again later.';
        this.weatherData = null;
        this.isLoading = false;
      },
    });
  }

  toggleUnits(): void {
    this.units = this.units === 'metric' ? 'imperial' : 'metric';
    if (this.countryName) {
      this.fetchWeatherData(this.countryName);
    }
  }
}
