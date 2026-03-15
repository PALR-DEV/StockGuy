import { Controller, Get, Inject, Param } from '@nestjs/common';
import { StockDataServiceService } from 'src/services/stock-data-service/stock-data-service.service';

@Controller('stocks')
export class StocksController {
    constructor(
        @Inject(StockDataServiceService)
        private readonly stockDataService: StockDataServiceService
    ) {}

    @Get('most-active')
    async getMostActiveStocks(): Promise<any> {
        return await this.stockDataService.getMostActiveStocksData();
    }

    @Get('symbol=:symbol')
    async getStockBySymbol(@Param('symbol') symbol: string): Promise<any> {
        return await this.stockDataService.getStockDataBySymbol(symbol);
    }
}
