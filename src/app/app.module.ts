import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromTrip from './store/trip/trip.reducer';

import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IvyCarouselModule } from 'angular-responsive-carousel';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { MainNavbarComponent } from './features/dashboard/components/main-navbar/main-navbar.component';
import { TripComponent } from './features/dashboard/pages/trip/trip.component';
import { TopNavbarComponent } from './features/dashboard/components/top-navbar/top-navbar.component';
import { ImageSliderComponent } from './features/dashboard/components/image-slider/image-slider.component';
import { TripListComponent } from './features/dashboard/components/trip-list/trip-list.component';
import { TripsComponent } from './features/dashboard/components/trips/trips.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { TripDialogComponent } from './features/dialogs/trip-dialog/trip-dialog.component';
import { ItineraryDialogComponent } from './features/dialogs/itinerary-dialog/itinerary-dialog.component';
import { MatModulesModule } from './mat-modules/mat-modules.module';
import { DeleteButtonComponent } from './shared/delete-button/delete-button.component';
import { TripEffects } from './store/trip/trip.effects';
import { CalendarComponent } from './features/dashboard/pages/calendar/calendar.component';
import { TimelineComponent } from './features/dashboard/pages/timeline/timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    NotFoundComponent,
    MainNavbarComponent,
    TripComponent,
    TopNavbarComponent,
    ImageSliderComponent,
    TripListComponent,
    TripDialogComponent,
    ItineraryDialogComponent,
    DeleteButtonComponent,
    TripsComponent,
    CalendarComponent,
    TimelineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    IvyCarouselModule,
    DragDropModule,
    MatModulesModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forFeature([TripEffects]),
    StoreModule.forFeature(fromTrip.tripFeatureKey, fromTrip.reducer),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
