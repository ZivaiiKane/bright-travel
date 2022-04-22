import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { Trip } from 'src/app/shared/models/trip.models';
import { TripsService } from '../../services/trips.service';
import { MatDialog } from '@angular/material/dialog';
import { ItineraryDialogComponent } from 'src/app/features/dialogs/itinerary-dialog/itinerary-dialog.component';
import { Store } from '@ngrx/store';
import { TripState } from 'src/app/store/trip/trip.reducer';
import { addTrip, getAllUserTrips } from 'src/app/store/trip/trip.actions';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit, OnDestroy {
  trips!: Trip[];
  sub!: Subscription;

  constructor(
    public tripsService: TripsService,
    public dialog: MatDialog,
    private tripStore: Store<TripState>
  ) {}

  ngOnInit(): void {
    this.tripStore.dispatch(getAllUserTrips());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.trips, event.previousIndex, event.currentIndex);
    this.tripsService.sortTrips(this.trips);
  }

  openTripDialog(): void {
    const dialogRef = this.dialog.open(ItineraryDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        debugger;
        const newTrip: Trip = {
          id: '',
          userId: '',
          destination: result,
          priority: this.trips.length,
        };

        this.tripStore.dispatch(
          addTrip({
            newTrip,
          })
        );
      }
    });
  }
}
