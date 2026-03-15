import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HttpModule } from '@nestjs/axios';
import { StockDataServiceService } from './services/stock-data-service/stock-data-service.service';
import { StocksController } from './controllers/stocks/stocks.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [AppController, StocksController, StocksController],
  providers: [AppService, StockDataServiceService],
})
export class AppModule {}
