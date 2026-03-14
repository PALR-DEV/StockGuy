import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { stockFeature } from "./+state/stock.feature";
import { loadStockRequest } from "./+state/stock.actions";

@Injectable({providedIn: 'root'})
export class StockFacade {
    private store = inject(Store);

    stocks$ = this.store.select(stockFeature.selectStocks);
    loading$ = this.store.select(stockFeature.selectLoading);

    loadStocks() {
        this.store.dispatch(loadStockRequest());
    }

    getMarketPriceBasedOnSymbol(symbol: string) {
        
    }
}