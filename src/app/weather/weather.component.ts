import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WeatherService } from '../services/weather.service';
import { WeatherResponse } from '../models/weather.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule here
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
})
export class WeatherComponent implements OnInit, AfterViewChecked {
  @ViewChild('map', { static: false }) mapContainer!: ElementRef;

  countryName!: string | null;
  weatherData: WeatherResponse | null = null;
  units: 'metric' | 'imperial' = 'metric';
  error: string | null = null;
  isLoading = false;
  private map: L.Map | null = null;

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

  ngAfterViewChecked(): void {
    if (!this.map && this.mapContainer) {
      this.initializeMap();
    }
  }

  fetchWeatherData(countryName: string): void {
    this.isLoading = true;
    this.weatherService.getWeatherData(countryName, this.units).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.error = null;
        this.isLoading = false;
        this.updateMap();
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

  getPrecipitation(): { type: string; unit: string; value: number } | null {
    if (this.weatherData?.rain) {
      return { type: 'Rain', unit: 'mm/h', value: this.weatherData.rain['1h'] };
    } else if (this.weatherData?.snow) {
      return { type: 'Snow', unit: 'mm/h', value: this.weatherData.snow['1h'] };
    }
    return null;
  }

  private initializeMap(): void {
    if (this.mapContainer && !this.map) {
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [51.505, -0.09], // Default center, will be updated based on data
        zoom: 6,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(this.map);
    }
  }

  private updateMap(): void {
    if (this.map && this.weatherData) {
      const { lat, lon } = this.weatherData.coord;

      if (lat && lon) {
        this.map.setView([lat, lon], 6);

        L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup(`Weather in ${this.weatherData.name}`)
          .openPopup();
      } else {
        console.error('Invalid coordinates received:', this.weatherData.coord);
      }
    }
  }
}
