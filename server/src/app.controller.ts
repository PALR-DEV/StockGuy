import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { StockDataServiceService } from './services/stock-data-service/stock-data-service.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly stockDataService: StockDataServiceService) {}

  @Get()
  async getHello(): Promise<any>{
    return {
      message:'Hello World!',
      healthy: true, 
    }
  }
}
