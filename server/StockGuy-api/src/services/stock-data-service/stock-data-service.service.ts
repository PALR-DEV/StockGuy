import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class StockDataServiceService {
    @Inject(HttpService)
    private readonly httpService: HttpService;

    async getMostActiveStocksData() :Promise<any>{
        const url = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=true&scrIds=MOST_ACTIVES&sortField=&sortType=&start=0&useRecordsResponse=true&fields=symbol%2CshortName&lang=en-US&region=US`
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            return error;
        }
    }

    async getStockDataBySymbol(symbol:string): Promise<any> {
        try {
            const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&source=cosaic`
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data;
            
        } catch (error) {
            return error;
        }
    }
}


