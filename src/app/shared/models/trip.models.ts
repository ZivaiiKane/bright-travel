export interface Trip {
  id: string;
  destination?: string;
  priority?: number;
  itinerary?: ItineraryItem[];
  userId: string;
}

export interface ItineraryItem {
  description?: string;
  tag?: 'green' | 'yellow' | 'gray' | 'white';
  start?: Date;
  end?: Date;
  cost?: number;
}
