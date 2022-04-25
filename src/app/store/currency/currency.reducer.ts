import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { CurrencyResponse } from 'src/app/shared/models/currency';
import * as CurrencyActions from './currency.actions';

export const currencyFeatureKey = 'currency';

export interface CurrencyState {
  currencyRates: CurrencyResponse[];
}

export const initialState: CurrencyState = {
  currencyRates: [],
};

export const reducer = createReducer(
  initialState,

  on(CurrencyActions.getCurrency, (state) => ({
    ...state,
  }))
);
