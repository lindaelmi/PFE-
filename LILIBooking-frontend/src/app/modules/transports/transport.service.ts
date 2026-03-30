import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transport } from './transport.model';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private mockTransports: Transport[] = [
    {
      id: 1,
      type: 'avion',
      company: 'Air France',
      departure: 'CDG',
      arrival: 'JFK',
      departureCity: 'Paris',
      arrivalCity: 'New York',
      departureTime: '10:30',
      arrivalTime: '13:45',
      duration: '8h 15',
      price: 450,
      availableSeats: 12,
      icon: 'fas fa-plane',
      amenities: ['Repas', 'Divertissement', 'Bagage cabine'],
      description: 'Vol direct confortable',
      rating: 4.5,
      reviewCount: 230
    },
    {
      id: 2,
      type: 'train',
      company: 'SNCF',
      departure: 'Paris',
      arrival: 'Lyon',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureTime: '09:00',
      arrivalTime: '11:30',
      duration: '2h 30',
      price: 65,
      availableSeats: 45,
      icon: 'fas fa-train',
      amenities: ['WiFi', 'Prise électrique', 'Bar'],
      description: 'TGV direct',
      rating: 4.2,
      reviewCount: 560
    },
    {
      id: 3,
      type: 'bus',
      company: 'FlixBus',
      departure: 'Marseille',
      arrival: 'Nice',
      departureCity: 'Marseille',
      arrivalCity: 'Nice',
      departureTime: '14:15',
      arrivalTime: '17:45',
      duration: '3h 30',
      price: 18,
      availableSeats: 28,
      icon: 'fas fa-bus',
      amenities: ['WiFi', 'Toilettes', 'Prise USB'],
      description: 'Trajet économique',
      rating: 4.0,
      reviewCount: 120
    },
    {
      id: 4,
      type: 'voiture',
      company: 'Europcar',
      departure: 'Aéroport CDG',
      arrival: 'Paris Centre',
      departureCity: 'Roissy',
      arrivalCity: 'Paris',
      departureTime: '08:00',
      arrivalTime: '09:00',
      duration: '1h',
      price: 89,
      availableSeats: 4,
      icon: 'fas fa-car',
      amenities: ['GPS', 'Siège enfant', 'Kilométrage illimité'],
      description: 'Location avec chauffeur',
      rating: 4.7,
      reviewCount: 89
    },
    {
      id: 5,
      type: 'avion',
      company: 'EasyJet',
      departure: 'ORY',
      arrival: 'BCN',
      departureCity: 'Paris',
      arrivalCity: 'Barcelone',
      departureTime: '07:20',
      arrivalTime: '09:05',
      duration: '1h 45',
      price: 120,
      availableSeats: 8,
      icon: 'fas fa-plane',
      amenities: ['Bagage cabine', 'Boissons payantes'],
      description: 'Vol low-cost',
      rating: 3.8,
      reviewCount: 310
    },
    {
      id: 6,
      type: 'train',
      company: 'Trenitalia',
      departure: 'Rome',
      arrival: 'Florence',
      departureCity: 'Rome',
      arrivalCity: 'Florence',
      departureTime: '11:05',
      arrivalTime: '12:35',
      duration: '1h 30',
      price: 45,
      availableSeats: 60,
      icon: 'fas fa-train',
      amenities: ['WiFi', 'Climatisation', 'Snack bar'],
      description: 'Train rapide',
      rating: 4.3,
      reviewCount: 420
    }
  ];

  getAllTransports(): Observable<Transport[]> {
    return of(this.mockTransports);
  }

  getTransportById(id: number): Observable<Transport | undefined> {
    return of(this.mockTransports.find(t => t.id === id));
  }

  getTransportTypes(): string[] {
    return [...new Set(this.mockTransports.map(t => t.type))];
  }

  getCompanies(): string[] {
    return [...new Set(this.mockTransports.map(t => t.company))];
  }

  getDurations(): string[] {
    // Durées uniques, simplifiées
    return [...new Set(this.mockTransports.map(t => t.duration))];
  }
}