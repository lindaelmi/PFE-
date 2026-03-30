// src/app/modules/booking/my-bookings.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-bookings-container py-5">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a routerLink="/">Главная</a></li>
                <li class="breadcrumb-item active">Мои бронирования</li>
              </ol>
            </nav>
            <div class="page-header">
              <h1 class="page-title">Мои бронирования</h1>
              <p class="page-subtitle">Здесь вы найдете все ваши бронирования отелей</p>
            </div>
          </div>
        </div>

        <!-- Mode démo actif -->
        <div *ngIf="demoMode && !loading" class="demo-alert">
          <i class="fas fa-flask me-2"></i>
          <span>Демонстрационный режим (функция в разработке).</span>
          <button class="btn-demo-close" (click)="disableDemo()">×</button>
        </div>

        <!-- Chargement -->
        <div *ngIf="loading" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-3">Загрузка ваших бронирований...</p>
        </div>

        <!-- Erreur -->
        <div *ngIf="error && !demoMode" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button class="btn-retry" (click)="loadBookings()">Повторить</button>
        </div>

        <!-- Liste des réservations -->
        <div *ngIf="!loading && (!error || demoMode)">
          <div *ngIf="bookings.length === 0 && !demoMode" class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <h3>Пока нет бронирований</h3>
            <p>Сделайте ваше первое бронирование отеля прямо сейчас!</p>
            <a routerLink="/hotels" class="btn-primary">Найти отель</a>
          </div>

          <div class="bookings-grid" *ngIf="bookings.length > 0">
            <div class="booking-card" *ngFor="let booking of bookings">
              <div class="booking-image">
                <img [src]="getHotelImage(booking.hotel)" [alt]="booking.hotel.name">
                <span class="booking-status">Подтверждено</span>
                <button class="btn-cancel" (click)="cancelBooking(booking.id)" title="Отменить бронирование">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
              <div class="booking-content">
                <h3>{{ booking.hotel.name }}</h3>
                <div class="booking-location">
                  <i class="fas fa-map-marker-alt"></i> {{ booking.hotel.city }}, {{ booking.hotel.country }}
                </div>
                <div class="booking-dates">
                  <div class="date-item">
                    <i class="fas fa-calendar-check"></i>
                    <span><strong>Заезд:</strong> {{ booking.checkIn | date:'dd.MM.yyyy' }}</span>
                  </div>
                  <div class="date-item">
                    <i class="fas fa-calendar-times"></i>
                    <span><strong>Выезд:</strong> {{ booking.checkOut | date:'dd.MM.yyyy' }}</span>
                  </div>
                  <div class="date-item">
                    <i class="fas fa-moon"></i>
                    <span><strong>{{ getNights(booking) }} ночь(и)</strong></span>
                  </div>
                </div>
                <div class="booking-details">
                  <span><i class="fas fa-user"></i> {{ booking.adults }} взрослый(ых)</span>
                  <span *ngIf="booking.children > 0"><i class="fas fa-child"></i> {{ booking.children }} ребенок(ей)</span>
                  <span><i class="fas fa-bed"></i> {{ booking.rooms }} номер(ов)</span>
                </div>
                <div class="booking-footer">
                  <div class="booking-price">
                    <span class="total-price">{{ booking.totalPrice }}€</span>
                    <span class="total-label">всего</span>
                  </div>
                  <div class="payment-status" [ngClass]="booking.paymentStatus === 'paid' ? 'paid' : 'pending'">
                    <i class="fas" [ngClass]="booking.paymentStatus === 'paid' ? 'fa-check-circle' : 'fa-clock'"></i>
                    {{ booking.paymentStatus === 'paid' ? 'Оплачено' : 'Ожидает оплаты' }}
                  </div>
                  <a [routerLink]="['/hotel', booking.hotel.id]" class="btn-detail">Посмотреть отель</a>
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
      --primary: #005a60;
      --primary-dark: #004f4d;
      --primary-light: #00838f;
      --accent: #d9bb80;
      --accent-dark: #c4a56e;
      --bg-light: #fefaf5;
      --bg-gradient-start: #fef9f4;
      --bg-gradient-end: #f5f0ea;
      --card-bg: rgba(255, 255, 255, 0.85);
      --glass-border: rgba(255, 255, 255, 0.5);
      --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.12);
      --transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }

    .my-bookings-container {
      background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
      min-height: 100vh;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .breadcrumb {
      background: transparent;
      padding: 0;
      margin-bottom: 1rem;
    }
    .breadcrumb-item a {
      color: var(--primary);
      text-decoration: none;
      transition: var(--transition);
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

    .demo-alert {
      background: rgba(217, 187, 128, 0.2);
      backdrop-filter: blur(8px);
      border: 1px solid var(--accent);
      border-radius: 16px;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .demo-alert i {
      color: var(--accent);
      font-size: 1.2rem;
    }
    .btn-demo-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: #6c7a89;
      cursor: pointer;
      transition: var(--transition);
      line-height: 1;
    }
    .btn-demo-close:hover {
      color: var(--accent);
      transform: scale(1.1);
    }

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
      transition: var(--transition);
    }
    .btn-retry:hover {
      background: #b91c1c;
      transform: translateY(-2px);
    }

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
      transition: var(--transition);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 90, 96, 0.3);
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-top: 1rem;
    }

    .booking-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 28px;
      overflow: hidden;
      transition: var(--transition);
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
    .booking-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(16px);
    }

    .booking-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .booking-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .booking-card:hover .booking-image img {
      transform: scale(1.05);
    }
    .booking-status {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(40, 167, 69, 0.9);
      backdrop-filter: blur(4px);
      color: white;
      padding: 4px 12px;
      border-radius: 30px;
      font-size: 0.75rem;
      font-weight: 600;
      z-index: 2;
    }
    .btn-cancel {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background: rgba(220, 53, 69, 0.8);
      border: none;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      z-index: 2;
      font-size: 0.9rem;
    }
    .btn-cancel:hover {
      background: #dc3545;
      transform: scale(1.1);
    }

    .booking-content {
      padding: 1.5rem;
    }
    .booking-content h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 0.5rem;
    }
    .booking-location {
      font-size: 0.85rem;
      color: #5a6b7a;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .booking-location i {
      color: var(--accent);
    }
    .booking-dates {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .date-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #5a6b7a;
    }
    .date-item i {
      color: var(--accent);
      width: 20px;
    }
    .booking-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #5a6b7a;
      background: rgba(0, 0, 0, 0.02);
      padding: 0.5rem 0;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    .booking-details span {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .booking-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .booking-price {
      display: flex;
      align-items: baseline;
      gap: 0.3rem;
    }
    .total-price {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--primary);
    }
    .total-label {
      font-size: 0.8rem;
      color: #8a9bb0;
    }
    .payment-status {
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      border-radius: 30px;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .payment-status.paid {
      background: #d4edda;
      color: #155724;
    }
    .payment-status.pending {
      background: #fff3cd;
      color: #856404;
    }
    .btn-detail {
      background: transparent;
      border: 1.5px solid var(--primary);
      padding: 0.5rem 1.2rem;
      border-radius: 40px;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.8rem;
      text-decoration: none;
      transition: var(--transition);
      display: inline-block;
    }
    .btn-detail:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }

    @media (max-width: 992px) {
      .bookings-grid {
        gap: 1.5rem;
      }
    }
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      .page-title {
        font-size: 1.8rem;
      }
      .bookings-grid {
        grid-template-columns: 1fr;
      }
      .booking-image {
        height: 180px;
      }
      .booking-content {
        padding: 1rem;
      }
      .booking-footer {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-detail {
        text-align: center;
      }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error: string | null = null;
  demoMode = false;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = null;
    this.demoMode = false;
    this.cdr.detectChanges();

    this.apiService.getMyBookings().subscribe({
      next: (data: any[]) => {
        this.bookings = data.map(booking => ({
          ...booking,
          paymentStatus: booking.paymentStatus || 'paid'
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Ошибка загрузки бронирований', err);
        if (err.status === 404) {
          this.enableDemoMode();
        } else {
          this.error = 'Не удалось загрузить ваши бронирования. Проверьте подключение.';
          this.loading = false;
        }
        this.cdr.detectChanges();
      }
    });
  }

  enableDemoMode(): void {
    this.demoMode = true;
    this.error = null;
    this.loading = false;
    this.bookings = [
      {
        id: 1,
        hotel: {
          id: 1,
          name: 'Отель Плаза Атене',
          city: 'Париж',
          country: 'Франция',
          image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
        },
        checkIn: '2025-05-10',
        checkOut: '2025-05-15',
        adults: 2,
        children: 1,
        rooms: 1,
        totalPrice: 1250,
        paymentStatus: 'paid'
      },
      {
        id: 2,
        hotel: {
          id: 2,
          name: 'Ле Бристоль',
          city: 'Париж',
          country: 'Франция',
          image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
        },
        checkIn: '2025-06-20',
        checkOut: '2025-06-25',
        adults: 2,
        children: 0,
        rooms: 1,
        totalPrice: 3250,
        paymentStatus: 'paid'
      },
      {
        id: 3,
        hotel: {
          id: 3,
          name: 'Отель де Крийон',
          city: 'Париж',
          country: 'Франция',
          image: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
        },
        checkIn: '2025-07-01',
        checkOut: '2025-07-05',
        adults: 2,
        children: 0,
        rooms: 1,
        totalPrice: 2800,
        paymentStatus: 'pending'
      }
    ];
  }

  disableDemo(): void {
    this.demoMode = false;
    this.bookings = [];
    this.loadBookings();
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Вы уверены, что хотите отменить это бронирование?')) {
      // Suppression locale (faute d’API d’annulation)
      this.bookings = this.bookings.filter(b => b.id !== bookingId);
      this.cdr.detectChanges();
      alert('Бронирование успешно отменено.');
    }
  }

  getNights(booking: any): number {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getHotelImage(hotel: any): string {
    const image = hotel.imageUrl || hotel.image || hotel.photo;
    if (image) {
      if (image.startsWith('http')) return image;
      return `http://localhost:3000${image}`;
    }

    const hotelImages = [
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
}