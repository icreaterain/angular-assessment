import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  countryName!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the country name from the route parameters
    this.countryName = this.route.snapshot.paramMap.get('countryName')!;
  }

  // Add any logic to fetch and display the weather data for this country
}
