import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Search & Filters
  searchTerm = '';
  filterRating = '';
  filterHotel = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Helper list for hotel filter
  hotelNames: string[] = [];

  // Delete modal
  showDeleteModal = false;
  reviewToDelete: any = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call (replace with real endpoint when available)
    setTimeout(() => {
      try {
        // This data could come from the backend via apiService.getReviews()
        // For now, use static demo data
        this.reviews = [
          { id: 1, author: 'Жан Дюпон', hotel: 'Отель Плаза Атене', rating: 5, comment: 'Отличный опыт! Персонал очень внимательный.', date: '15/01/2024' },
          { id: 2, author: 'Мари Симон', hotel: 'Ле Бристоль', rating: 5, comment: 'Идеальное путешествие. Обязательно вернусь.', date: '10/01/2024' },
          { id: 3, author: 'Томас Ришар', hotel: 'Ритц Париж', rating: 4, comment: 'Очень хороший отель, но дороговато.', date: '05/01/2024' },
          { id: 4, author: 'Екатерина Соколова', hotel: 'Four Seasons Moscow', rating: 5, comment: 'Потрясающий вид на Москву!', date: '20/02/2024' },
          { id: 5, author: 'Алексей Иванов', hotel: 'Отель Мартинес', rating: 4, comment: 'Хороший сервис, удобное расположение.', date: '12/03/2024' },
          { id: 6, author: 'Ольга Петрова', hotel: 'Four Seasons Tunis', rating: 5, comment: 'Райский отдых! Спасибо.', date: '05/04/2024' },
          { id: 7, author: 'Дмитрий Волков', hotel: 'Marriott Mena House', rating: 5, comment: 'Вид на пирамиды – незабываемо.', date: '18/04/2024' },
          { id: 8, author: 'Наталья Кузнецова', hotel: 'Отель Негреско', rating: 4, comment: 'Красивый отель, но шумновато.', date: '22/05/2024' },
          { id: 9, author: 'Сергей Николаев', hotel: 'Four Seasons Istanbul', rating: 5, comment: 'Роскошь и комфорт. Отличный спа-центр.', date: '10/06/2024' },
          { id: 10, author: 'Анна Михайлова', hotel: 'Ciragan Palace Kempinski', rating: 5, comment: 'Впечатляющий дворец на Босфоре.', date: '15/07/2024' }
        ];
        this.hotelNames = [...new Set(this.reviews.map(r => r.hotel))];
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Ошибка загрузки отзывов', err);
        this.errorMessage = 'Не удалось загрузить отзывы.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 800); // simulate network delay
  }

  applyFilters(): void {
    let filtered = [...this.reviews];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.author.toLowerCase().includes(term) ||
        r.hotel.toLowerCase().includes(term) ||
        r.comment.toLowerCase().includes(term)
      );
    }

    if (this.filterRating) {
      const ratingNum = parseInt(this.filterRating, 10);
      filtered = filtered.filter(r => r.rating === ratingNum);
    }

    if (this.filterHotel) {
      filtered = filtered.filter(r => r.hotel === this.filterHotel);
    }

    this.filteredReviews = filtered;
    this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedReviews(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredReviews.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get averageRating(): string {
    if (this.reviews.length === 0) return '0';
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
  }

  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  confirmDelete(review: any): void {
    this.reviewToDelete = review;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.reviewToDelete = null;
  }

  deleteReviewConfirmed(): void {
    if (!this.reviewToDelete) return;

    // Real API call would go here
    // this.apiService.deleteReview(this.reviewToDelete.id).subscribe({ ... })

    // Remove from local array
    this.reviews = this.reviews.filter(r => r.id !== this.reviewToDelete.id);
    this.applyFilters(); // reapply filters
    this.closeDeleteModal();
    this.cdr.detectChanges();
  }
}