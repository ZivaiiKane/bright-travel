import { NgModule } from '@angular/core';
import { TripComponent } from '../features/dashboard/pages/trip/trip.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: TripComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LazyModule {}
