import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, merge, pipe } from 'rxjs';
import { map, mergeMap, catchError, concatMap } from 'rxjs/operators';
import { CurrencyService } from 'src/app/shared/services/currency.service';

import * as CurrencyActions from './currency.actions';

@Injectable()
export class CurrencyEffects {
  getCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.getCurrency),
      mergeMap(() =>
        this.currencyService.getCurrencyExchange().pipe(
          map(() => CurrencyActions.getCurrency()),
          catchError((error) => {
            console.error(error);
            this.snackBar.open('Failed to get currency API.');
            return EMPTY;
          })
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private currencyService: CurrencyService,
    private snackBar: MatSnackBar
  ) {}
}
