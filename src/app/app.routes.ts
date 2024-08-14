import { Routes } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { WeatherComponent } from './weather/weather.component';

export const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesComponent },
  { path: 'weather/:countryName', component: WeatherComponent }, // Route with a parameter
];
