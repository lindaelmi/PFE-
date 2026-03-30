import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class AdminHotelsComponent implements OnInit {
  hotels: any[] = [];
  filteredHotels: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Filters
  searchTerm = '';
  filterContinent = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Modal
  showModal = false;
  editingHotel: any = null;
  hotelFormData: any = {
    name: '',
    city: '',
    country: '',
    continent: '',
    stars: 3,
    pricePerNight: 0,
    description: '',
    amenities: '',
    rating: 4.5,
    reviewCount: 0,
    isActive: true
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки отелей', err);
        this.errorMessage = 'Не удалось загрузить список отелей. Проверьте подключение к серверу.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.hotels];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(term) ||
        h.city.toLowerCase().includes(term) ||
        h.country.toLowerCase().includes(term)
      );
    }

    if (this.filterContinent) {
      filtered = filtered.filter(h => h.continent === this.filterContinent);
    }

    this.filteredHotels = filtered;
    this.totalPages = Math.ceil(this.filteredHotels.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedHotels(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredHotels.slice(start, end);
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

  openAddModal(): void {
    this.editingHotel = null;
    this.hotelFormData = {
      name: '',
      city: '',
      country: '',
      continent: 'Европа',
      stars: 3,
      pricePerNight: 0,
      description: '',
      amenities: '',
      rating: 4.5,
      reviewCount: 0,
      isActive: true
    };
    this.showModal = true;
  }

  openEditModal(hotel: any): void {
    this.editingHotel = hotel;
    this.hotelFormData = { ...hotel };
    if (Array.isArray(this.hotelFormData.amenities)) {
      this.hotelFormData.amenities = this.hotelFormData.amenities.join(', ');
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveHotel(): void {
    const hotelData = { ...this.hotelFormData };
    if (typeof hotelData.amenities === 'string') {
      hotelData.amenities = hotelData.amenities.split(',').map((a: string) => a.trim());
    }

    if (this.editingHotel) {
      this.apiService.updateHotel(this.editingHotel.id, hotelData).subscribe({
        next: () => {
          this.loadHotels();
          this.closeModal();
        },
        error: (err) => {
          console.error('Ошибка обновления', err);
          alert('Ошибка при обновлении отеля. Попробуйте позже.');
        }
      });
    } else {
      this.apiService.createHotel(hotelData).subscribe({
        next: () => {
          this.loadHotels();
          this.closeModal();
        },
        error: (err) => {
          console.error('Ошибка создания', err);
          alert('Ошибка при создании отеля. Проверьте введенные данные.');
        }
      });
    }
  }

  deleteHotel(id: number): void {
    if (confirm('Удалить этот отель? Это действие нельзя отменить.')) {
      this.apiService.deleteHotel(id).subscribe({
        next: () => {
          this.hotels = this.hotels.filter(h => h.id !== id);
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка удаления', err);
          alert('Ошибка при удалении отеля.');
        }
      });
    }
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}