import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { StockApiService } from '../+state/api.service';
import { StockFacade } from '../stock.facade';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-landing-page-component',
  imports: [ButtonModule],
  templateUrl: './landing-page-component.html',
  styleUrl: './landing-page-component.css',
})
export class LandingPageComponent {
  private apiService = inject(StockApiService);
  // test(
  //   payload = {
  //     function: 'TIME_SERIES_WEEKLY',
  //     symbol: 'IBM',
  //     apiKey: environment.apiKey,
  //   },
  // ) {
  //   this.apiService.getDailyStock(payload).subscribe();
  // }

}
