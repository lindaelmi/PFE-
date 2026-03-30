export interface Transport {
  id: number;
  type: 'avion' | 'train' | 'bus' | 'voiture';
  company: string;
  departure: string;
  arrival: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  icon: string;
  amenities?: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
}