import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Search & Filters
  searchTerm = '';
  filterHotel = '';
  dateFrom = '';
  dateTo = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Helper list for hotel filter
  hotelNames: string[] = [];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Use localStorage (backend admin endpoint can be added later)
    try {
      const stored = localStorage.getItem('bookings');
      this.bookings = stored ? JSON.parse(stored) : [];
      this.hotelNames = [...new Set(this.bookings.map(b => b.hotelName).filter(name => name))];
      this.applyFilters();
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading bookings from localStorage', err);
      this.errorMessage = 'Не удалось загрузить бронирования.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  applyFilters(): void {
    let filtered = [...this.bookings];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.id?.toString().includes(term) ||
        (b.hotelName && b.hotelName.toLowerCase().includes(term)) ||
        (b.userEmail && b.userEmail.toLowerCase().includes(term))
      );
    }

    if (this.filterHotel) {
      filtered = filtered.filter(b => b.hotelName === this.filterHotel);
    }

    if (this.dateFrom) {
      const from = new Date(this.dateFrom);
      filtered = filtered.filter(b => new Date(b.checkIn) >= from);
    }
    if (this.dateTo) {
      const to = new Date(this.dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(b => new Date(b.checkIn) <= to);
    }

    this.filteredBookings = filtered;
    this.totalPages = Math.ceil(this.filteredBookings.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedBookings(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredBookings.slice(start, end);
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

  get totalRevenue(): number {
    return this.bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  }
}