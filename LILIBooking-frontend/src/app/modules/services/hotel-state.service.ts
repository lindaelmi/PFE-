// src/app/modules/services/hotel-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HotelStateService {
  private hotel: any = null;

  setHotel(hotel: any): void {
    console.log('📦 HotelStateService: stockage de l’hôtel', hotel?.name);
    this.hotel = hotel;
  }

  getHotel(): any {
    console.log('📦 HotelStateService: récupération de l’hôtel', this.hotel?.name);
    return this.hotel;
  }

  clear(): void {
    this.hotel = null;
  }
}