import { createAction } from "@ngrx/store";
import { StockNASDAQModel } from "../../../models/stockNASDAQ.model";


export const loadStockRequest = createAction(
    '[Stock API] Load Stock Request',
)
export const loadStockSuccess = createAction(
    '[Stock API] Load Stock Success',
    (payload: StockNASDAQModel[]) => ({ payload })
)

export const loadStockFailure = createAction(
    '[Stock API] Load Stock Failure',
    (error: unknown) => ({ error })
)