import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'lilibooking_favorite_hotels';

  constructor() {}

  // Récupère la liste des IDs d'hôtels favoris
  getFavorites(): number[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Sauvegarde la liste
  private saveFavorites(favorites: number[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }

  // Ajoute un hôtel aux favoris (s'il n'est pas déjà présent)
  addFavorite(hotelId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(hotelId)) {
      favorites.push(hotelId);
      this.saveFavorites(favorites);
    }
  }

  // Supprime un hôtel des favoris
  removeFavorite(hotelId: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(id => id !== hotelId);
    this.saveFavorites(favorites);
  }

  // Vérifie si un hôtel est dans les favoris
  isFavorite(hotelId: number): boolean {
    return this.getFavorites().includes(hotelId);
  }

  // Vide tous les favoris
  clearFavorites(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}