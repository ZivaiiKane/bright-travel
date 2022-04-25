import { createAction, props } from '@ngrx/store';
import { CurrencyResponse, CurrencyType } from '../../shared/models/currency';

export const getCurrency = createAction('[Currency] getCurrency');
