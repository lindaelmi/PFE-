import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favorites-container">
      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-12">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a routerLink="/">Главная</a></li>
                <li class="breadcrumb-item active">Избранное</li>
              </ol>
            </nav>
            <div class="page-header">
              <h1 class="page-title">Избранное</h1>
              <p class="page-subtitle">Все ваши любимые отели в одном месте</p>
            </div>
          </div>
        </div>

        <!-- Состояние загрузки -->
        <div *ngIf="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-3">Загрузка избранного...</p>
        </div>

        <!-- Сообщение об ошибке -->
        <div *ngIf="error" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button class="btn-retry" (click)="loadFavorites()">Повторить</button>
        </div>

        <!-- Список избранного -->
        <div *ngIf="!loading && !error">
          <div *ngIf="favoriteHotels.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-heart-broken"></i>
            </div>
            <h3>Пока нет избранных отелей</h3>
            <p>Исследуйте наши отели и добавляйте понравившиеся, нажав на иконку ❤️</p>
            <a routerLink="/hotels" class="btn-primary">Посмотреть отели</a>
          </div>

          <div class="favorites-grid" *ngIf="favoriteHotels.length > 0">
            <div class="hotel-card" *ngFor="let hotel of favoriteHotels">
              <div class="card-image">
                <img [src]="getHotelImage(hotel)" [alt]="hotel.name">
                <button class="favorite-remove" (click)="removeFavorite(hotel.id)" title="Удалить из избранного">
                  <i class="fas fa-heart-broken"></i>
                </button>
              </div>
              <div class="card-content">
                <h3>{{ hotel.name }}</h3>
                <div class="location">
                  <i class="fas fa-map-marker-alt"></i> {{ hotel.city }}, {{ hotel.country }}
                </div>
                <p class="description">{{ hotel.description | slice:0:100 }}...</p>
                <div class="card-footer">
                  <div class="price">
                    <span class="price-value">{{ hotel.pricePerNight }}€</span>
                    <span class="price-period">/ ночь</span>
                  </div>
                  <a [routerLink]="['/hotel', hotel.id]" class="btn-outline">Подробнее</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #2c7a6e;
      --primary-dark: #1f5a50;
      --primary-light: #4f9e8f;
      --accent: #e6b17e;
      --accent-dark: #d49c62;
      --bg-light: #fefaf5;
      --card-bg: rgba(255, 255, 255, 0.85);
      --glass-border: rgba(255, 255, 255, 0.5);
      --shadow-sm: 0 8px 20px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 12px 30px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 25px 40px rgba(0, 0, 0, 0.12);
      --transition-smooth: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }

    .favorites-container {
      background: linear-gradient(135deg, #fef9f4 0%, #f5f0ea 100%);
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Breadcrumb */
    .breadcrumb {
      background: transparent;
      padding: 0;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }
    .breadcrumb-item a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-item a:hover {
      color: var(--accent);
    }
    .breadcrumb-item.active {
      color: #6c7a89;
    }
    .breadcrumb-item + .breadcrumb-item::before {
      content: '/';
      color: #9aa6b5;
    }

    /* Page header */
    .page-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 0.5rem;
    }
    .page-subtitle {
      color: #5a6b7a;
      font-size: 1rem;
    }

    /* Loading state */
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: 32px;
      margin: 2rem auto;
      max-width: 500px;
    }
    .loading-state .spinner-border {
      width: 3rem;
      height: 3rem;
      color: var(--primary);
    }

    /* Error state */
    .error-state {
      text-align: center;
      padding: 3rem;
      background: rgba(255, 235, 235, 0.9);
      backdrop-filter: blur(8px);
      border-radius: 32px;
      margin: 2rem auto;
      max-width: 500px;
    }
    .error-state i {
      font-size: 2rem;
      color: #dc2626;
      margin-bottom: 1rem;
    }
    .error-state p {
      color: #7f1a1a;
      margin-bottom: 1.5rem;
    }
    .btn-retry {
      background: #dc2626;
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 40px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-retry:hover {
      background: #b91c1c;
      transform: translateY(-2px);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-radius: 48px;
      margin: 2rem auto;
      max-width: 550px;
    }
    .empty-icon {
      font-size: 4rem;
      color: var(--accent);
      margin-bottom: 1rem;
    }
    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--primary-dark);
      margin-bottom: 0.5rem;
    }
    .empty-state p {
      color: #5a6b7a;
      margin-bottom: 1.5rem;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      padding: 0.7rem 1.8rem;
      border-radius: 40px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(44, 122, 110, 0.3);
    }

    /* Grid des favoris */
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-top: 1rem;
    }

    /* Carte hôtel (style glassmorphism) */
    .hotel-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 32px;
      overflow: hidden;
      transition: var(--transition-smooth);
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
    .hotel-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(16px);
    }

    .card-image {
      position: relative;
      height: 220px;
      overflow: hidden;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .hotel-card:hover .card-image img {
      transform: scale(1.05);
    }
    .favorite-remove {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
      font-size: 1rem;
    }
    .favorite-remove:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .card-content {
      padding: 1.5rem;
    }
    .card-content h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 0.5rem;
    }
    .location {
      font-size: 0.85rem;
      color: #5a6b7a;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .location i {
      color: var(--accent);
      font-size: 0.8rem;
    }
    .description {
      font-size: 0.85rem;
      line-height: 1.5;
      color: #6c7a89;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
    .price {
      display: flex;
      align-items: baseline;
      gap: 0.2rem;
    }
    .price-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--primary);
    }
    .price-period {
      font-size: 0.8rem;
      color: #8a9bb0;
    }
    .btn-outline {
      background: transparent;
      border: 1.5px solid var(--primary);
      padding: 0.5rem 1.2rem;
      border-radius: 40px;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.8rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-outline:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      .page-title {
        font-size: 1.8rem;
      }
      .favorites-grid {
        gap: 1rem;
      }
      .card-image {
        height: 180px;
      }
      .card-content {
        padding: 1rem;
      }
      .card-content h3 {
        font-size: 1.1rem;
      }
      .price-value {
        font-size: 1.2rem;
      }
      .btn-outline {
        padding: 0.4rem 1rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  favoriteHotels: any[] = [];

  private hotelThemedImages: string[] = [
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/250700/pexels-photo-250700.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/1893341/pexels-photo-1893341.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/1648772/pexels-photo-1648772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/264379/pexels-photo-264379.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/259863/pexels-photo-259863.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ];

  constructor(
    private apiService: ApiService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.error = null;

    const favoriteIds = this.favoritesService.getFavorites();

    if (favoriteIds.length === 0) {
      this.favoriteHotels = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.apiService.getHotels().subscribe({
      next: (hotels) => {
        this.favoriteHotels = hotels.filter(hotel => favoriteIds.includes(hotel.id));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка при загрузке отелей', err);
        this.error = 'Не удалось загрузить избранное. Проверьте подключение к серверу.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeFavorite(hotelId: number): void {
    this.favoritesService.removeFavorite(hotelId);
    this.loadFavorites();
  }

  getHotelImage(hotel: any): string {
    if (hotel.image) return hotel.image;
    if (hotel.imageUrl) return hotel.imageUrl;

    const customImages: { [key: number]: string } = {};
    if (customImages[hotel.id]) {
      return customImages[hotel.id];
    }

    const index = (hotel.id - 1) % this.hotelThemedImages.length;
    return this.hotelThemedImages[index];
  }
}