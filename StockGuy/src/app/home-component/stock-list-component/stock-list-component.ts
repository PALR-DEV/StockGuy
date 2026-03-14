import { Component, inject, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { StockFacade } from '../stock.facade';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-stock-list-component',
  imports: [CommonModule, TableModule, ProgressSpinnerModule],
  templateUrl: './stock-list-component.html',
  styleUrl: './stock-list-component.css',
})
export class StockListComponent implements OnInit{
  private stockFacade = inject(StockFacade);
  public stocks$ = this.stockFacade.stocks$;
  public loading$ = this.stockFacade.loading$;
  ngOnInit(): void {
    this.stockFacade.loadStocks();
  }
}
