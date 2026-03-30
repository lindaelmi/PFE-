import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  continent: string;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private apiUrl = environment.apiUrl;

  private hotelsSubject = new BehaviorSubject<Hotel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public hotels$ = this.hotelsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadHotels(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get<Hotel[]>(`${this.apiUrl}/hotels`).pipe(
      map(hotels => hotels.map(hotel => ({
        ...hotel,
        amenities: Array.isArray(hotel.amenities) ? hotel.amenities : []
      }))),
      catchError(err => {
        console.error('Erreur chargement hôtels', err);
        this.errorSubject.next('Impossible de charger les hôtels. Vérifiez le serveur.');
        return of([]);
      }),
      tap(hotels => {
        this.hotelsSubject.next(hotels);
        this.loadingSubject.next(false);
      })
    ).subscribe();
  }

  refresh(): void {
    this.loadHotels();
  }
}