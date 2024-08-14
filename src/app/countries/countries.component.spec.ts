import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountriesService } from '../services/countries.service';
import { of, throwError } from 'rxjs';
import { CountriesComponent } from './countries.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { WeatherComponent } from '../weather/weather.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;
  let countriesService: CountriesService;
  let router: Router;
  let location: Location;

  const mockCountries = [
    {
      iso2: 'AF',
      iso3: 'AFG',
      country: 'Afghanistan',
      cities: [
        'Herat',
        'Kabul',
        'Kandahar',
        'Molah',
        'Rana',
        'Shar',
        'Sharif',
        'Wazir Akbar Khan',
      ],
    },
    {
      iso2: 'AL',
      iso3: 'ALB',
      country: 'Albania',
      cities: [
        'Elbasan',
        'Petran',
        'Pogradec',
        'Shkoder',
        'Tirana',
        'Ura Vajgurore',
      ],
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatToolbarModule,
        MatIconModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        CountriesService,
        provideRouter([
          { path: 'weather/:countryName', component: WeatherComponent },
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore Angular Material specific errors
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    countriesService = TestBed.inject(CountriesService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a list of countries', waitForAsync(() => {
    spyOn(countriesService, 'getCountries').and.returnValue(
      of({ data: mockCountries })
    );

    fixture.detectChanges(); // Trigger ngOnInit

    fixture.whenStable().then(() => {
      expect(component.dataSource.data.length).toBe(2);
      expect(component.isLoading).toBeFalse();
      expect(component.error).toBeNull();
    });
  }));

  it('should handle error when loading countries fails', waitForAsync(() => {
    spyOn(countriesService, 'getCountries').and.returnValue(
      throwError('Failed to load')
    );

    fixture.detectChanges(); // Trigger ngOnInit

    fixture.whenStable().then(() => {
      expect(component.dataSource).toBeDefined(); // Ensure dataSource is defined
      expect(component.dataSource.data.length).toBe(0);
      expect(component.isLoading).toBeFalse();
      expect(component.error).toBe('Failed to load countries data');
    });
  }));

  it('should get correct flag URL', () => {
    const iso2 = 'CA';
    const expectedUrl = `https://flagcdn.com/w40/ca.png`;
    expect(component.getFlagUrl(iso2)).toBe(expectedUrl);
  });

  it('should navigate to weather page with the correct country name on row click', waitForAsync(() => {
    spyOn(countriesService, 'getCountries').and.returnValue(
      of({ data: mockCountries })
    );

    fixture.detectChanges(); // Trigger ngOnInit

    spyOn(router, 'navigate');

    fixture.whenStable().then(() => {
      // Simulate row click
      component.onRowClick('Albania');

      // Assert that navigation happened with the correct parameter
      expect(router.navigate).toHaveBeenCalledWith(['/weather', 'Albania']);
    });
  }));
});
