export interface StockNASDAQModel {
    symbol: string;
    name: string;
    currency: string;
    exchange: string;
    country: string;
    type: string;
    cfi_code: string;
    price: number;
}