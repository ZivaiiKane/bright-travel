import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, merge, pipe } from 'rxjs';
import { map, mergeMap, catchError, concatMap } from 'rxjs/operators';
import { TripsService } from 'src/app/features/dashboard/services/trips.service';

import * as TripActions from './trip.actions';

@Injectable()
export class TripEffects {
  getTrips$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.getAllUserTrips),
      mergeMap(() =>
        this.tripsService
          .getAllUserTrips()
          .pipe(
            map((trips) =>
              TripActions.getUserTripsCompelete({ userTrips: trips })
            )
          )
      ),
      catchError((error) => {
        this.snackBar.open('Failed to get trips.');
        return EMPTY;
      })
    );
  });

  addTrip$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.addTrip),
      mergeMap(({ newTrip }) =>
        this.tripsService.createTrip(newTrip).pipe(
          map(() => TripActions.getAllUserTrips()),
          catchError((error) => {
            this.snackBar.open('Failed to add your trip.');
            return EMPTY;
          })
        )
      )
    );
  });

  updateItineraryItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.updateItineraryItem),
      mergeMap(({ updatedItineraryItem, tripId }) =>
        this.tripsService
          .updateItineraryItem(tripId, updatedItineraryItem)
          .pipe(
            map(() =>
              TripActions.updateItineraryItem({
                updatedItineraryItem: updatedItineraryItem,
                tripId: tripId,
              })
            ),
            catchError((error) => {
              this.snackBar.open('Failed to update your itinerary.');
              return EMPTY;
            })
          )
      )
    );
  });

  deleteTrip$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.deleteTrip),
      mergeMap(({ tripId }) =>
        this.tripsService.deleteTrip(tripId).pipe(
          map(() => TripActions.deleteTrip({ tripId })),
          catchError((error) => {
            this.snackBar.open('Failed to delete your itinerary.');
            return EMPTY;
          })
        )
      )
    );
  });

  removeItineraryItem = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.deleteItineraryItem),
      mergeMap(({ tripId, removedTrip }) =>
        this.tripsService.removeItineraryItem(tripId, removedTrip).pipe(
          map(() => TripActions.deleteItineraryItem({ tripId, removedTrip })),
          catchError((error) => {
            this.snackBar.open('Failed to delete your itinerary.');
            return EMPTY;
          })
        )
      )
    );
  });

  //   sortTrips$ = createEffect(() => {
  //     return this.actions$.pipe(
  //       ofType(TripActions.sortTrips),
  //       mergeMap(async ({ sortedTrips }) =>
  //         this.tripsService.sortTrips(sortedTrips).pipe(
  //           map(() => TripActions.sortTrips({ sortedTrips })),
  //           catchError((error) => {
  //             this.snackBar.open('Failed to delete your itinerary.');
  //             return EMPTY;
  //           })
  //         )
  //       )
  //     );
  //   });

  constructor(
    private actions$: Actions,
    private tripsService: TripsService,
    private snackBar: MatSnackBar
  ) {}
}
