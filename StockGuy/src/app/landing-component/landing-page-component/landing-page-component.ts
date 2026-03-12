import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StockApiService } from '../../stock-module/stock-crud/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-landing-page-component',
  imports: [ButtonModule],
  templateUrl: './landing-page-component.html',
  styleUrl: './landing-page-component.css',
})
export class LandingPageComponent {
  private apiService = inject(StockApiService);
  test(
    payload = {
      function: 'TIME_SERIES_WEEKLY',
      symbol: 'IBM',
      apiKey: environment.apiKey,
    },
  ) {
    this.apiService.getDailyStock(payload).subscribe();
  }
}
