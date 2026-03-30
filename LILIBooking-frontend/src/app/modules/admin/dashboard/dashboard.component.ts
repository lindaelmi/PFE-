import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('bookingsChart') bookingsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  today: Date = new Date();

  stats = {
    users: 0,
    hotels: 0,
    bookings: 0,
    revenue: 0
  };
  isLoading = true;
  errorMessage = '';

  recentActivities: any[] = [];

  private bookingsChart: Chart | undefined;
  private revenueChart: Chart | undefined;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentActivities();
  }

  ngAfterViewInit(): void {
    if (!this.isLoading && !this.errorMessage) {
      this.createCharts();
    }
  }

  loadStats(): void {
    this.isLoading = true;
    this.apiService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.createCharts(), 0);
      },
      error: (err) => {
        console.error('Ошибка загрузки статистики', err);
        this.errorMessage = 'Не удалось загрузить статистику.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRecentActivities(): void {
    // Simulate API call
    setTimeout(() => {
      this.recentActivities = [
        {
          type: 'booking',
          icon: 'fas fa-calendar-check',
          text: 'Новое бронирование: Мария Соколова забронировала Отель Плаза Атене',
          time: '5 минут назад'
        },
        {
          type: 'user',
          icon: 'fas fa-user-plus',
          text: 'Новый пользователь: Алексей Иванов зарегистрировался',
          time: '25 минут назад'
        },
        {
          type: 'review',
          icon: 'fas fa-star',
          text: 'Новый отзыв: 5 звезд для Four Seasons Moscow',
          time: '1 час назад'
        },
        {
          type: 'booking',
          icon: 'fas fa-calendar-check',
          text: 'Бронирование отменено: Дмитрий Петров отменил Ritz Paris',
          time: '2 часа назад'
        }
      ];
      this.cdr.detectChanges();
    }, 500);
  }

  refreshData(): void {
    this.loadStats();
    this.loadRecentActivities();
  }

  private createCharts(): void {
    this.bookingsChart?.destroy();
    this.revenueChart?.destroy();

    if (this.bookingsChartRef) {
      this.bookingsChart = new Chart(this.bookingsChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
          datasets: [{
            label: 'Бронирования',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#446965',
            backgroundColor: 'rgba(68, 105, 101, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#446965',
            pointBorderColor: '#fff',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, position: 'top' } },
          scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
      });
    }

    if (this.revenueChartRef) {
      this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
          datasets: [{
            label: 'Доход (€)',
            data: [1200, 1900, 3000, 5000, 2300, 3400],
            backgroundColor: '#d9bb80',
            borderRadius: 8,
            barPercentage: 0.7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, position: 'top' } },
          scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
      });
    }
  }
}