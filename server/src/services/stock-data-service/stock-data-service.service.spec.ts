import { Test, TestingModule } from '@nestjs/testing';
import { StockDataServiceService } from './stock-data-service.service';

describe('StockDataServiceService', () => {
  let service: StockDataServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockDataServiceService],
    }).compile();

    service = module.get<StockDataServiceService>(StockDataServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
