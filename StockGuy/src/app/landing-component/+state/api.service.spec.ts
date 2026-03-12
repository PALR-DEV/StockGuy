import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { StockApiService } from "./api.service";
import { StockApiParameters } from "../../../models/stock-parameters.model";
import { map, tap } from "rxjs";

describe("StockApiService", () => {
    let service : StockApiService;
    let httpMock: HttpTestingController;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StockApiService],
        });
        service = TestBed.inject(StockApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    })
})