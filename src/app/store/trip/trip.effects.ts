import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, merge, pipe } from 'rxjs';
import { map, mergeMap, catchError, concatMap, first } from 'rxjs/operators';
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
        console.error(error);
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
            console.error(error);
            return EMPTY;
          })
        )
      )
    );
  });

  updateTrip$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.updateTrip),
      concatMap((action) =>
        this.tripsService.getTripDocId(action.trip).pipe(
          first(),
          map((res) => {
            if (!res) throw new Error('Unable to find trip');
            return TripActions.updateTripById({
              trip: action.trip,
              tripDocId: res,
            });
          }),
          catchError((error) => {
            this.snackBar.open('Failed to update your user by ID.');
            console.error(error);
            return EMPTY;
          })
        )
      )
    );
  });

  updateTripById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.updateTripById),
      concatMap((action) =>
        this.tripsService.updateTripById(action.trip, action.tripDocId).pipe(
          map(() => TripActions.getAllUserTrips()),
          catchError((error) => {
            this.snackBar.open('Failed to update your user by ID.');
            console.error(error);
            return EMPTY;
          })
        )
      )
    );
  });

  updateItineraryItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.updateItineraryItem),
      mergeMap(({ itinerary, tripId }) =>
        this.tripsService.updateItineraryItem(tripId, itinerary).pipe(
          map(() =>
            TripActions.updateItineraryItem({
              itinerary: itinerary,
              tripId: tripId,
            })
          ),
          catchError((error) => {
            this.snackBar.open('Failed to update your itinerary.');
            console.error(error);
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
            console.error(error);
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
            console.error(error);
            return EMPTY;
          })
        )
      )
    );
  });

  sortTrips$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripActions.sortTrips),
      mergeMap(({ userTrips }) =>
        this.tripsService.sortTrips(userTrips).pipe(
          map(() => TripActions.sortTrips({ userTrips })),
          catchError((error) => {
            this.snackBar.open('Failed to sort itinerary items.');
            return EMPTY;
          })
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private tripsService: TripsService,
    private snackBar: MatSnackBar
  ) {}
}
