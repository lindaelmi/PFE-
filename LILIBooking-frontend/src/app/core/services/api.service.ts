import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ----- Hôtels -----
  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hotels`);
  }

  getHotel(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hotels/${id}`);
  }

  searchHotels(criteria: any): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(criteria).forEach(key => {
      const value = criteria[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<any[]>(`${this.apiUrl}/hotels/search`, { params });
  }

  // ----- Statistiques admin (protégées) -----
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // ----- Gestion des utilisateurs (admin) -----
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // ----- Gestion des hôtels (admin) -----
  createHotel(hotelData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/hotels`, hotelData);
  }

  updateHotel(id: number, hotelData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/hotels/${id}`, hotelData);
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hotels/${id}`);
  }

  // ----- Mise à jour du profil utilisateur -----
  updateUser(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, data);
  }

  // ----- Réservations (client) -----
  /**
   * Récupère toutes les réservations de l'utilisateur connecté.
   */
  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings`);
  }

  /**
   * Crée une nouvelle réservation.
   * @param bookingData Données de la réservation (hôtelId, dates, etc.)
   */
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }
}