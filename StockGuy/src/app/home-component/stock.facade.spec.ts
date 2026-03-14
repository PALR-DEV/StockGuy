import { TestBed } from "@angular/core/testing";
import { StockFacade } from "./stock.facade";
import { Store } from "@ngrx/store";
import { loadStockRequest } from "./+state/stock.actions";
import { provideMockStore, MockStore } from '@ngrx/store/testing';


describe('stockFacade', () => {
    let facade: StockFacade;
    let store: Store;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[
                StockFacade,
                provideMockStore({ initialState: {} }),
            ]
        });
        facade = TestBed.inject(StockFacade);
        store = TestBed.inject(Store);
    })

     afterEach(() => {
    jest.restoreAllMocks();
    });

    it('should dispatch loadStockRequest action when loadStocks is called', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        facade.loadStocks();
        expect(dispatchSpy).toHaveBeenCalledWith(loadStockRequest());
    });
})