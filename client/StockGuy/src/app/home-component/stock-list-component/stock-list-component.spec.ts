import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockListComponent } from './stock-list-component';
import { provideMockStore } from '@ngrx/store/testing';
import { stockFeature } from '../+state/stock.feature';

describe('StockListComponent', () => {
  let component: StockListComponent;
  let fixture: ComponentFixture<StockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockListComponent],
      providers:[
        provideMockStore({
        selectors: [
          { selector: stockFeature.selectStocks, value: [] },
          { selector: stockFeature.selectLoading, value: false }
        ]
      })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
