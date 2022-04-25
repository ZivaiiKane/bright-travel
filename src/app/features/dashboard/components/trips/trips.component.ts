import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TripState } from 'src/app/store/trip/trip.reducer';
import {
  deleteTrip,
  updateItineraryItem,
} from 'src/app/store/trip/trip.actions';
import { ItineraryItem } from 'src/app/shared/models/trip.models';
import { TripDialogComponent } from 'src/app/features/dialogs/trip-dialog/trip-dialog.component';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent {
  @Input() trips: any;

  constructor(private dialog: MatDialog, private tripStore: Store<TripState>) {}

  tripDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.trips.itineraryItem,
      event.previousIndex,
      event.currentIndex
    );

    const itinerary = [...this.trips.itinerary];

    const tripId = this.trips.id;

    console.log('Delete id: ', tripId);

    this.tripStore.dispatch(updateItineraryItem({ itinerary, tripId }));
  }

  openDialog(itineraryItem?: ItineraryItem, indx?: number): void {
    const newItineraryItem = { tag: 'yellow' };
    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '400px',
      data: itineraryItem
        ? {
            itineraryItem: { ...itineraryItem },
            isNew: false,
            itineraryItemId: this.trips.id,
            indx,
          }
        : {
            itineraryItem: {
              ...newItineraryItem,
              start: new Date(),
              end: new Date(),
            },
            isNew: true,
          },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.isNew) {
          const itinerary: ItineraryItem[] = [
            ...this.trips.itinerary,
            {
              ...result.itineraryItem,
              start: result.itineraryItem.start.getTime(),
              end: result.itineraryItem.end.getTime(),
            },
          ];

          const tripId = this.trips.id;

          this.tripStore.dispatch(updateItineraryItem({ itinerary, tripId }));
        } else {
          const update = [...this.trips.itinerary];

          console.log('Update: ', update);

          update.splice(result.indx, 1, result.itineraryItem);

          const itinerary: ItineraryItem[] = [...this.trips.itinerary];

          const tripId = this.trips.id;

          this.tripStore.dispatch(updateItineraryItem({ itinerary, tripId }));
        }
      }
    });
  }

  handleDelete() {
    const tripId = this.trips.id;

    this.tripStore.dispatch(deleteTrip({ tripId }));
  }
}
