import { NgModule } from '@angular/core';
import { TripComponent } from '../features/dashboard/pages/trip/trip.component';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from '../features/dashboard/pages/calendar/calendar.component';

const routes: Routes = [
  { path: 'dashboard', component: TripComponent },
  { path: 'calendar', component: CalendarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LazyModule {}
