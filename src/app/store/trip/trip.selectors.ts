import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTrips from './trip.reducer';

export const selectTripState = createFeatureSelector<fromTrips.TripState>(
  fromTrips.tripFeatureKey
);

export const selectIsLoading = createSelector(
  selectTripState,
  (state) => state.isLoading
);

export const selectUserTrips = createSelector(
  selectTripState,
  (state) => state.userTrips
);

export const selectTrip = createSelector(
  selectTripState,
  (state) => state.selectedTrip
);

export const selectNewTrip = createSelector(
  selectTripState,
  (state) => state.newTrip
);
