import { createEffect, Actions, ofType } from '@ngrx/effects';
import { StockApiService } from './api.service';
import { loadStockRequest, loadStockSuccess, loadStockFailure } from './stock.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { StockNASDAQModel } from '../../../models/stockNASDAQ.model';

@Injectable()
export class StockEffects {
    private actions$ = inject(Actions);
    private api = inject(StockApiService);
    loadStocks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadStockRequest),
            mergeMap(() =>
                this.api.getNASDAQStocks().pipe(
                    map((stock: StockNASDAQModel[]) => loadStockSuccess(stock)),
                    catchError((error) => of(loadStockFailure(error)))
                )
            )

        )
    );
}


