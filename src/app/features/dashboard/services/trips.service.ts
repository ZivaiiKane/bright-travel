import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { switchMap, map, Observable, from, mergeMap, EMPTY } from 'rxjs';

import { Trip, ItineraryItem } from 'src/app/shared/models/trip.models';
import { async } from '@firebase/util';

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
                  description: '',
                  tag: 'green',
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

  updateItineraryItem(tripId: string, itineraryItems: ItineraryItem[]) {
    return from(
      this.db.collection('trips').doc(tripId).update({ itineraryItems })
    );
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
