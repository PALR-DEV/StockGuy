import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StockApiParameters } from '../../../models/stock-parameters.model';

@Injectable({ providedIn: 'root' })
export class StockApiService {
  private http = inject(HttpClient);
  private baseStockUrl = environment.apiUrl;

  getDailyStock(data: StockApiParameters) {}
}
