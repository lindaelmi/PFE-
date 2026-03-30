import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  editMode = false;
  editForm: any = {};
  favorites: any[] = [];
  bookings: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Images de secours pour les favoris
  private fallbackImages = [
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  ];

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.editForm = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          email: user.email
        };
      }
    });
    this.loadFavorites();
    this.loadBookings();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editForm = {
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        phone: this.user.phone || '',
        email: this.user.email
      };
    }
  }

  saveProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.updateUser(this.user.id, this.editForm).subscribe({
      next: (updatedUser) => {
        this.authService.updateUser(updatedUser);
        this.user = updatedUser;
        this.editMode = false;
        this.isLoading = false;
        this.successMessage = 'Профиль успешно обновлен!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Ошибка обновления профиля', err);
        this.errorMessage = 'Ошибка при обновлении профиля.';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    this.favorites = stored ? JSON.parse(stored) : [];
  }

  loadBookings(): void {
    const stored = localStorage.getItem('bookings');
    this.bookings = stored ? JSON.parse(stored) : [];
  }

  removeFavorite(hotelId: number): void {
    this.favorites = this.favorites.filter(fav => fav.id !== hotelId);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  getHotelImage(hotel: any): string {
    if (hotel.image) return hotel.image;
    if (hotel.imageUrl) return hotel.imageUrl;
    const index = (hotel.id - 1) % this.fallbackImages.length;
    return this.fallbackImages[index];
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}