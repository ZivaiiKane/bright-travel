import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { Trip } from 'src/app/shared/models/trip.models';
import * as TripActions from './trip.actions';

export const tripFeatureKey = 'trip';

export interface TripState {
  userTrips: Trip[];
  newTrip: Trip;
  selectedTrip: Trip | null;
  isLoading: boolean;
}

export const initialState: TripState = {
  userTrips: [],
  isLoading: false,
  newTrip: {
    id: '',
    destination: '',
    priority: 0,
    itinerary: [],
    userId: '',
  },
  selectedTrip: null,
};

export const reducer = createReducer(
  initialState,

  on(TripActions.getAllUserTrips, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(TripActions.getUserTripsCompelete, (state, { userTrips }) => ({
    ...state,
    isLoading: false,
    userTrips,
  })),

  on(TripActions.addTrip, (state, { newTrip }) => ({
    ...state,
    newTrip,
  })),

  on(TripActions.deleteTrip, (state, { tripId }) => ({
    ...state,
    tripId,
  })),

  on(TripActions.sortTrips, (state, { userTrips }) => ({
    ...state,
    userTrips,
  })),

  on(TripActions.updateItineraryItem, (state, { itinerary, tripId }) => ({
    ...state,
    itinerary,
    tripId,
  })),

  on(TripActions.deleteItineraryItem, (state, { tripId, removedTrip }) => ({
    ...state,
    tripId,
    removedTrip,
  }))
);
