import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CountriesService } from '../services/countries.service';
import { of, throwError } from 'rxjs';
import { CountriesComponent } from './countries.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { WeatherComponent } from '../weather/weather.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

class FakeCountriesService {
  getCountries() {
    return of({
      data: [
        {
          iso2: 'AF',
          iso3: 'AFG',
          country: 'Afghanistan',
          cities: ['Herat', 'Kabul', 'Kandahar'],
        },
        {
          iso2: 'AL',
          iso3: 'ALB',
          country: 'Albania',
          cities: ['Elbasan', 'Tirana'],
        },
      ],
    });
  }
}

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;
  let router: Router;
  let location: Location;
  let fakeCountriesService: FakeCountriesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatToolbarModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: CountriesService, useClass: FakeCountriesService },
        provideRouter([
          { path: 'weather/:countryName', component: WeatherComponent },
        ]),
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore Angular Material specific errors
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fakeCountriesService = TestBed.inject(
      CountriesService
    ) as FakeCountriesService;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a list of countries', fakeAsync(() => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should get correct flag URL', () => {
    const iso2 = 'CA';
    const expectedUrl = `https://flagcdn.com/w40/ca.png`;
    expect(component.getFlagUrl(iso2)).toBe(expectedUrl);
  });

  it('should navigate to weather page with the correct country name on row click', fakeAsync(() => {
    spyOn(router, 'navigate');

    fixture.whenStable().then(() => {
      // Simulate row click
      component.onRowClick('Albania');

      // Assert that navigation happened with the correct parameter
      expect(router.navigate).toHaveBeenCalledWith(['/weather', 'Albania']);
    });
  }));
});
