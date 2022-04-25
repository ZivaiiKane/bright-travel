import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyResponse } from '../models/currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  getCurrencyExchange() {
    return this.http.get<CurrencyResponse>(
      `https://api.currencyapi.com/v3/latest`
    );
  }
}
