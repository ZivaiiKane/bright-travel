import { createAction, props } from '@ngrx/store';
import { Trip, ItineraryItem } from 'src/app/shared/models/trip.models';

export const addTrip = createAction(
  '[Trip] addTrip',
  props<{ newTrip: Trip }>()
);

export const deleteTrip = createAction(
  '[Trip] deleteTrip',
  props<{ tripId: string }>()
);

export const updateItineraryItem = createAction(
  '[Trip] updateItineraryItem',
  props<{ updatedItineraryItem: ItineraryItem[]; tripId: string }>()
);

export const getAllUserTrips = createAction('[Trip] getAllUserTrips');

export const getUserTripsCompelete = createAction(
  '[Trip] getUserTripsComplete',
  props<{ userTrips: Trip[] }>()
);

export const sortTrips = createAction(
  '[Trip] sortTrips',
  props<{ sortedTrips: Trip[] }>()
);

export const deleteItineraryItem = createAction(
  '[Trip] deleteItineraryItem',
  props<{ tripId: string; removedTrip: ItineraryItem }>()
);
