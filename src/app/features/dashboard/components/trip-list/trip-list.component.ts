import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, Subscription } from 'rxjs';
import { Trip } from 'src/app/shared/models/trip.models';
import { TripsService } from '../../services/trips.service';
import { MatDialog } from '@angular/material/dialog';
import { ItineraryDialogComponent } from 'src/app/features/dialogs/itinerary-dialog/itinerary-dialog.component';
import { Store, select } from '@ngrx/store';
import { TripState } from 'src/app/store/trip/trip.reducer';
import {
  addTrip,
  getAllUserTrips,
  sortTrips,
} from 'src/app/store/trip/trip.actions';
import * as TripsSelectors from 'src/app/store/trip/trip.selectors';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit, OnDestroy {
  trips$: Observable<Trip[]> | undefined;
  trips!: Trip[];
  isLoading$: Observable<boolean> | undefined;
  sub!: Subscription;

  constructor(
    public tripsService: TripsService,
    public dialog: MatDialog,
    private tripStore: Store<TripState>
  ) {}

  ngOnInit(): void {
    this.tripStore.dispatch(getAllUserTrips());

    this.isLoading$ = this.tripStore.pipe(
      select(TripsSelectors.selectIsLoading)
    );

    this.trips$ = this.tripStore.pipe(select(TripsSelectors.selectUserTrips));

    this.trips$ = this.tripStore.pipe(select(TripsSelectors.selectUserTrips));
    this.trips$.subscribe((val) => (this.trips = val));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    const tripsArr = [...this.trips];

    moveItemInArray(tripsArr, event.previousIndex, event.currentIndex);

    const userTrips: Trip[] = tripsArr;

    this.tripStore.dispatch(sortTrips({ userTrips }));
  }

  openTripDialog(): void {
    const dialogRef = this.dialog.open(ItineraryDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
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
