import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { switchMap, map, Observable, from, mergeMap, EMPTY } from 'rxjs';

import { Trip, ItineraryItem } from 'src/app/shared/models/trip.models';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  createTrip(data: Trip): Observable<DocumentReference<Trip>> {
    const today = new Date();

    return from(
      this.afAuth.currentUser.then((currentUser) => currentUser?.uid)
    ).pipe(
      mergeMap((uid) => {
        if (uid) {
          return from(
            this.db.collection<Trip>('trips').add({
              ...data,
              userId: uid,
              id: this.db.createId(),
              itinerary: [
                {
                  description: 'Your trip description goes here...',
                  tag: 'white',
                  start: today,
                  end: today,
                  cost: 0,
                },
              ],
            })
          );
        }
        return EMPTY;
      })
    );
  }

  deleteTrip(tripId: string) {
    return from(this.db.collection('trips').doc(tripId).delete());
  }

  removeItineraryItem(tripId: string, itineraryItem: ItineraryItem) {
    return from(
      this.db
        .collection('trips')
        .doc(tripId)
        .update({
          itineraryItems:
            firebase.firestore.FieldValue.arrayRemove(itineraryItem),
        })
    );
  }

  // Gets ID of trip document
  getTripDocId(trip: Trip) {
    if (trip?.id) return EMPTY;

    return this.db
      .collection<Trip>('trips', (ref) =>
        ref.where('id', '==', trip.id).limit(1)
      )
      .snapshotChanges()
      .pipe(
        map((actions: DocumentChangeAction<Trip>[]) => {
          if (actions.length === 0) return null;

          return actions[0].payload.doc.id;
        })
      );
  }

  updateTripById(trip: Trip, id: string) {
    if (id.length === 0) return EMPTY;

    return from(
      this.db
        .collection('trips')
        .doc(id)
        .update({ ...trip })
    );
  }

  updateItineraryItem(tripId: string, itinerary: ItineraryItem[]) {
    return from(this.db.collection('trips').doc(tripId).update({ itinerary }));
  }

  getAllUserTrips() {
    return from(
      this.afAuth.authState.pipe(
        switchMap((user) => {
          if (user) {
            return this.db
              .collection<Trip>('trips', (ref) =>
                ref.where('userId', '==', user.uid).orderBy('priority')
              )
              .valueChanges({ idField: 'id' });
          } else {
            return [];
          }
        })
      )
    );
  }

  sortTrips(trips: Trip[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = trips.map((i) => db.collection('trips').doc(i.id));

    refs.forEach((ref, indx) => batch.update(ref, { priority: indx }));

    return from(batch.commit());
  }
}
