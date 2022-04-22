import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-itinerary-dialog',
  templateUrl: './itinerary-dialog.component.html',
  styleUrls: ['./itinerary-dialog.component.scss'],
})
export class ItineraryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ItineraryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
