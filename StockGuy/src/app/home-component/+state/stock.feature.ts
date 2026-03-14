import { createFeature, createReducer, on } from "@ngrx/store";
import { loadStockFailure, loadStockRequest, loadStockSuccess } from "./stock.actions";
import { StockNASDAQModel } from "../../../models/stockNASDAQ.model";

export interface StockState {
    stocks: StockNASDAQModel[];
    loading: boolean | undefined;
    error: unknown | undefined;
}

export const inititalState: StockState = {
    loading:false,
    stocks: [],
    error: undefined
}

export const stockFeature = createFeature({
    name: 'stocks',
    reducer: createReducer(
        inititalState,
        on(loadStockRequest,state => ({...state, loading: true, error: undefined})),
        on(loadStockSuccess,(state, {payload}) => ({...state, stocks: payload, loading: false, error: undefined})),
        on(loadStockFailure,(state, {error}) => ({...state, loading: false, error}))
    )
})