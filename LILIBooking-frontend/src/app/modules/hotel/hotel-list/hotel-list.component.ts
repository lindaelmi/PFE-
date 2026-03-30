import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HotelService, Hotel } from '../hotel.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  // Filtre local (BehaviorSubject pour la réactivité)
  private continentSubject = new BehaviorSubject<string>('all');
  selectedContinent$ = this.continentSubject.asObservable();
  continents: string[] = ['all', 'Европа', 'Азия', 'Африка']; // Traduit en russe

  // Observable combiné : hôtels filtrés selon le continent sélectionné
  filteredHotels$: Observable<Hotel[]>;

  constructor(
    public hotelService: HotelService,
    private favoritesService: FavoritesService
  ) {
    // Combinaison réactive : hotels$ + sélection du continent
    this.filteredHotels$ = combineLatest([
      this.hotelService.hotels$,
      this.selectedContinent$
    ]).pipe(
      map(([hotels, continent]) => {
        if (continent === 'all') return hotels;
        return hotels.filter(h => h.continent === continent);
      })
    );
  }

  ngOnInit(): void {
    this.hotelService.loadHotels();
  }

  filterByContinent(continent: string): void {
    this.continentSubject.next(continent);
  }

  getImageUrl(hotel: Hotel): string {
    const image = hotel.imageUrl;
    if (image) {
      if (image.startsWith('http')) return image;
      return `http://localhost:3000${image}`;
    }
    const hotelImages: string[] = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a30805a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a30805a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    ];
    const index = (hotel.id - 1) % hotelImages.length;
    return hotelImages[index];
  }

  getStarRating(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');
    return stars;
  }

  toggleFavorite(hotelId: number): void {
    if (this.favoritesService.isFavorite(hotelId)) {
      this.favoritesService.removeFavorite(hotelId);
    } else {
      this.favoritesService.addFavorite(hotelId);
    }
  }

  isFavorite(hotelId: number): boolean {
    return this.favoritesService.isFavorite(hotelId);
  }

  refresh(): void {
    this.hotelService.refresh();
  }
}