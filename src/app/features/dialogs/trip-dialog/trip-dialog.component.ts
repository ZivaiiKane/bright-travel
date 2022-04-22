import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TripState } from 'src/app/store/trip/trip.reducer';
import { deleteItineraryItem } from 'src/app/store/trip/trip.actions';
import { ItineraryItem } from '../../../shared/models/trip.models';

@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.scss'],
})
export class TripDialogComponent {
  tagOptions = ['green', 'yellow', 'gray'];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<TripDialogComponent>,
    private tripStore: Store<TripState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  nonNoClick(): void {
    this.dialogRef.close();
  }

  deleteTrip() {
    const id: string = this.data.itineraryItemId;
    const item: ItineraryItem = this.data.itineraryItem;

    const removeditineraryItem = {
      tripId: id,
      removedTrip: item,
    };
    this.tripStore.dispatch(deleteItineraryItem(removeditineraryItem));
  }
}
