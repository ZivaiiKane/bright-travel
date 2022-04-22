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
import { ItineraryDialogComponent } from 'src/app/features/dialogs/itinerary-dialog/itinerary-dialog.component';

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

    const updatedItineraryItem = [...this.trips.itinerary];

    const tripId = this.trips.id;

    this.tripStore.dispatch(
      updateItineraryItem({ updatedItineraryItem, tripId })
    );
  }

  openDialog(itineraryItem?: ItineraryItem, indx?: number): void {
    const newItineraryItem = { tag: 'green' };
    const dialogRef = this.dialog.open(ItineraryDialogComponent, {
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
          const updatedItineraryItem: ItineraryItem[] = [
            ...this.trips.itinerary,
            {
              ...result.itineraryItem,
              start: result.itineraryItem.start.getTime(),
              end: result.itineraryItem.end.getTime(),
            },
          ];

          const tripId = this.trips.id;

          this.tripStore.dispatch(
            updateItineraryItem({ updatedItineraryItem, tripId })
          );
        } else {
          const update = this.trips.itinerary;

          update.splice(result.indx, 1, result.itineraryItem);

          const updatedItineraryItem: ItineraryItem[] = [
            ...this.trips.itinerary,
          ];

          const tripId = this.trips.id;

          this.tripStore.dispatch(
            updateItineraryItem({ updatedItineraryItem, tripId })
          );
        }
      }
    });
  }

  handleDelete() {
    const tripId = this.trips.id;

    this.tripStore.dispatch(deleteTrip({ tripId }));
  }
}
