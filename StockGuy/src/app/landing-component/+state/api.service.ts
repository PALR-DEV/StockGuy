import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StockApiParameters } from '../../../models/stock-parameters.model';
import { tap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockApiService {
  private http = inject(HttpClient);
  private baseStockUrl = environment.apiUrl;

  getDailyStock(payload: StockApiParameters): Observable<unknown> {
    const test = `${this.baseStockUrl}function=${payload.function}&symbol=${payload.symbol}&apikey=${payload.apiKey}`;
    const response = this.http.get<unknown>(test).pipe(tap((resp) => console.log(resp)));
    return response;
  }
}
