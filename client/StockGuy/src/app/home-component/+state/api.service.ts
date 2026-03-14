import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StockApiParameters } from '../../../models/stock-parameters.model';
import { tap, Observable, map } from 'rxjs';
import { StockNASDAQModel } from '../../../models/stockNASDAQ.model';

@Injectable({ providedIn: 'root' })
export class StockApiService {
  private http = inject(HttpClient);
  getDailyStock(payload: StockApiParameters): Observable<unknown> {
    const test = `function=${payload.function}&symbol=${payload.symbol}&apikey=${payload.apiKey}`;
    const response = this.http.get<unknown>(test).pipe(tap((resp) => console.log(resp)));
    return response;
  }

  getNASDAQStocks(): Observable<StockNASDAQModel[]> {
    let params = new HttpParams()
    .set('exchange', 'NASDAQ')
    .set('country', 'US')
    .set('outputsize', '10')
    return this.http.get<{data: StockNASDAQModel[]}>(`/stocks`, { params }).pipe(map((resp) => {
      return resp.data
    }));
  }

  // getMarketPrice(symbol:string): Observable<unknown> {
  //   return this.http.get<unknown>(`https://query1.finance.yahoo.com/v8/finance/chart/LMT?interval=1m&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&source=cosaic`).pipe(
  //     tap((resp) => 
  //       console.log(resp)
  //     ),
  //   )
  // }
}
