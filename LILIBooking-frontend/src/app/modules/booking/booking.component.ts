import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <h2>Бронирование отеля #{{ hotelId }}</h2>
      
      <form #bookingForm="ngForm" (ngSubmit)="onSubmit(bookingForm)" *ngIf="!loading && !success">
        <div class="mb-3">
          <label for="checkin" class="form-label">Дата заезда</label>
          <input type="date" class="form-control" id="checkin" name="checkin" [(ngModel)]="bookingData.checkIn" required>
        </div>
        <div class="mb-3">
          <label for="checkout" class="form-label">Дата выезда</label>
          <input type="date" class="form-control" id="checkout" name="checkout" [(ngModel)]="bookingData.checkOut" required>
        </div>
        <div class="mb-3">
          <label for="adults" class="form-label">Взрослые</label>
          <input type="number" class="form-control" id="adults" name="adults" min="1" [(ngModel)]="bookingData.adults" required>
        </div>
        <div class="mb-3">
          <label for="children" class="form-label">Дети</label>
          <input type="number" class="form-control" id="children" name="children" min="0" [(ngModel)]="bookingData.children">
        </div>
        <div class="mb-3">
          <label for="rooms" class="form-label">Количество номеров</label>
          <input type="number" class="form-control" id="rooms" name="rooms" min="1" [(ngModel)]="bookingData.rooms" required>
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold">Способ оплаты</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="paymentMethod" id="card" value="card" [(ngModel)]="bookingData.paymentMethod" required>
            <label class="form-check-label" for="card">Банковская карта (онлайн-оплата)</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="paymentMethod" id="onsite" value="onsite" [(ngModel)]="bookingData.paymentMethod" required>
            <label class="form-check-label" for="onsite">Оплата на месте</label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="bookingForm.invalid || loading">
          {{ loading ? 'Обработка...' : 'Подтвердить бронирование' }}
        </button>
      </form>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger mt-3">
        {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-3" (click)="retry()">Повторить</button>
      </div>

      <div *ngIf="success" class="alert alert-success mt-3">
        Бронирование подтверждено! Ваше бронирование сохранено.
        <a routerLink="/bookings" class="alert-link">Мои бронирования</a>
      </div>
    </div>
  `,
  styles: [`.container { max-width: 600px; }`]
})
export class BookingComponent implements OnInit {
  hotelId: number | null = null;
  bookingData = {
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    paymentMethod: ''
  };
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.hotelId)) {
      this.router.navigate(['/hotels']);
    }
  }

  onSubmit(form: any): void {
    if (form.invalid) return;

    this.loading = true;
    this.error = null;

    const payload = {
      hotelId: this.hotelId,
      ...this.bookingData
    };

    this.apiService.createBooking(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/bookings']), 3000);
      },
      error: (err) => {
        console.error('Erreur réservation', err);
        this.error = err.error?.message || 'Произошла ошибка. Пожалуйста, попробуйте снова.';
        this.loading = false;
      }
    });
  }

  retry(): void {
    this.error = null;
    this.loading = false;
  }
}