import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { HotelStateService } from '../../services/hotel-state.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent implements OnInit, AfterViewInit {
  hotel: any = null;
  similarHotels: any[] = [];
  loading = false;
  error = false;

  checkin: string = '';
  checkout: string = '';
  guests: number = 2;
  roomType: string = '';
  selectedRoom: any = null;
  nights: number = 0;
  totalPrice: number = 0;
  minDate: string = '';

  paymentMethod: string = 'cash';
  showPaymentModal: boolean = false;

  selectedImageIndex: number = 0;
  showLightbox: boolean = false;

  private map: any = null;

  private readonly hotelImagePool = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a30805a0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
  ];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public authService: AuthService,
    private hotelState: HotelStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/hotels']);
      return;
    }
    const id = Number(idParam);

    const fromService = this.hotelState.getHotel();
    if (fromService && fromService.id === id) {
      console.log('📦 HotelDetails - récupéré depuis le service', fromService.name);
      this.hotel = fromService;
      this.afterHotelReady();
      return;
    }

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { hotel: any };
    if (state?.hotel?.id === id) {
      console.log('📦 HotelDetails - récupéré depuis l’état', state.hotel.name);
      this.hotel = state.hotel;
      this.afterHotelReady();
      return;
    }

    console.log('📦 HotelDetails - pas de données en mémoire, chargement API');
    this.hotel = this.getDefaultHotel(id);
    this.afterHotelReady();
    this.loadHotelById(id);
  }

  ngAfterViewInit(): void {}

  public loadHotel(id: string): void {
    this.loadHotelById(Number(id));
  }

  private afterHotelReady(): void {
    this.ensureHotelProperties();
    this.initMap();
    this.loadSimilarHotels();
    this.initDates();
  }

  private ensureHotelProperties(): void {
    if (!this.hotel) return;

    // 1. Parse JSON fields (images, rooms, reviews)
    if (typeof this.hotel.images === 'string') {
      try { this.hotel.images = JSON.parse(this.hotel.images); } catch(e) { this.hotel.images = []; }
    }
    if (typeof this.hotel.rooms === 'string') {
      try { this.hotel.rooms = JSON.parse(this.hotel.rooms); } catch(e) { this.hotel.rooms = []; }
    }
    if (typeof this.hotel.reviews === 'string') {
      try { this.hotel.reviews = JSON.parse(this.hotel.reviews); } catch(e) { this.hotel.reviews = []; }
    }

    // 2. Amenities (optional)
    if (typeof this.hotel.amenities === 'string') {
      try {
        this.hotel.amenities = JSON.parse(this.hotel.amenities);
      } catch(e) {
        let raw = this.hotel.amenities;
        raw = raw.replace(/^\[/, '').replace(/\]$/, '');
        raw = raw.replace(/\\"/g, '"');
        const matches = raw.match(/"([^"]*)"/g);
        if (matches) {
          this.hotel.amenities = matches.map((m: string) => m.replace(/^"|"$/g, '').replace(/[\[\]]/g, '').trim());
        } else {
          this.hotel.amenities = raw.split(',').map((item: string) => item.replace(/^"|"$/g, '').trim());
        }
        this.hotel.amenities = this.hotel.amenities.filter((a: string) => a && a.length > 0);
      }
    }

    // 3. Name, description, rating, price
    this.hotel.name = this.hotel.name || 'Отель без названия';
    this.hotel.description = this.hotel.description || 'Описание отсутствует.';
    this.hotel.rating = this.hotel.rating ?? 0;
    this.hotel.pricePerNight = this.hotel.pricePerNight ?? 0;

    // 4. Location
    if (!this.hotel.location && this.hotel.city && this.hotel.country) {
      this.hotel.location = `${this.hotel.city}, ${this.hotel.country}`;
    } else if (!this.hotel.location) {
      this.hotel.location = 'Расположение неизвестно';
    }

    // 5. Images: generate 3 different images if needed
    if (!Array.isArray(this.hotel.images) || this.hotel.images.length === 0) {
      this.hotel.images = this.generateHotelGalleryImages(this.hotel.id);
    } else {
      const firstImage = this.hotel.images[0];
      const allSame = this.hotel.images.every((img: string) => img === firstImage);
      if (allSame && firstImage) {
        this.hotel.images = this.generateHotelGalleryImages(this.hotel.id);
      }
    }

    // 6. Ensure amenities is an array
    if (!Array.isArray(this.hotel.amenities)) {
      this.hotel.amenities = [];
    }

    // 7. Default rooms
    if (!Array.isArray(this.hotel.rooms) || this.hotel.rooms.length === 0) {
      const basePrice = this.hotel.pricePerNight || 100;
      this.hotel.rooms = [
        {
          type: 'Стандартный номер',
          description: 'Уютный и функциональный',
          capacity: 2,
          price: basePrice,
          features: ['Двуспальная кровать', 'Собственная ванная комната', 'WiFi']
        },
        {
          type: 'Делюкс номер',
          description: 'Более просторный с видом',
          capacity: 2,
          price: Math.round(basePrice * 1.5),
          features: ['Кровать king-size', 'Вид на город', 'Ванна', 'WiFi']
        },
        {
          type: 'Люкс',
          description: 'Отдельная гостиная зона',
          capacity: 4,
          price: Math.round(basePrice * 2.5),
          features: ['Гостиная', 'Две спальни', 'Джакузи', 'WiFi']
        }
      ];
    }

    // 8. Default reviews
    if (!Array.isArray(this.hotel.reviews) || this.hotel.reviews.length === 0) {
      this.hotel.reviews = [
        {
          author: 'Довольный клиент',
          avatar: 'ДК',
          rating: this.hotel.rating || 4,
          date: new Date().toLocaleDateString(),
          comment: 'Отличное пребывание, отель удобно расположен.'
        },
        {
          author: 'Частый путешественник',
          avatar: 'ЧП',
          rating: this.hotel.rating || 4,
          date: new Date().toLocaleDateString(),
          comment: 'Приветливый персонал, чистая комната.'
        }
      ];
    }

    console.log('🎯 Amenities finales :', this.hotel.amenities);
  }

  private getDefaultHotel(id: number): any {
    return {
      id: id,
      name: `Отель ${id}`,
      location: 'Загрузка данных...',
      description: 'Детальная информация загружается.',
      rating: 0,
      pricePerNight: 0,
      images: [],
      amenities: [],
      rooms: [],
      reviews: []
    };
  }

  private loadHotelById(id: number): void {
    this.loading = true;
    console.log('🔄 loading = true');
    this.cdr.detectChanges();
    this.apiService.getHotel(id).subscribe({
      next: (response: any) => {
        try {
          console.log('📡 Réponse API brute :', response);
          const hotelData = response.data || response;
          if (hotelData && hotelData.id) {
            console.log('✅ Hôtel chargé :', hotelData.name);
            this.hotel = hotelData;
            this.ensureHotelProperties();
            this.initMap();
            this.loadSimilarHotels();
            this.error = false;
            console.log('❌ error mis à false');
          } else {
            console.warn('⚠️ La réponse API ne contient pas d’hôtel valide');
            this.error = true;
          }
        } catch (err) {
          console.error('❌ Erreur dans le traitement de la réponse', err);
          this.error = true;
        } finally {
          this.loading = false;
          console.log('🔄 loading mis à false');
          console.log('🏨 Hotel final :', this.hotel);
          setTimeout(() => {
            this.cdr.detectChanges();
            console.log('🔄 detectChanges forcé après timeout');
          }, 0);
        }
      },
      error: (err: any) => {
        console.error('❌ Erreur API', err);
        this.error = true;
        this.loading = false;
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    });
  }

  loadSimilarHotels(): void {
    // Here you can load similar hotels from the API
    this.similarHotels = [];
  }

  initMap(): void {
    if (!this.hotel || !this.hotel.lat || !this.hotel.lng) return;
    setTimeout(() => {
      const mapContainer = document.getElementById('hotel-map');
      if (mapContainer && !this.map) {
        this.map = L.map(mapContainer).setView([this.hotel.lat, this.hotel.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        L.marker([this.hotel.lat, this.hotel.lng])
          .addTo(this.map)
          .bindPopup(this.hotel.name)
          .openPopup();
      }
    }, 100);
  }

  private initDates(): void {
    this.minDate = this.getTodayDate();
    this.checkin = this.getTodayDate();
    this.checkout = this.getTomorrowDate();
  }

  // ========================
  // Image handling
  // ========================

  private generateHotelGalleryImages(hotelId: number): string[] {
    const images: string[] = [];
    const poolSize = this.hotelImagePool.length;
    for (let i = 0; i < 3; i++) {
      const idx = (hotelId - 1 + i) % poolSize;
      images.push(this.hotelImagePool[idx]);
    }
    return images;
  }

  getHotelImageUrl(hotel: any): string {
    const image = hotel.imageUrl || hotel.image || hotel.photo;
    if (image && image.startsWith('http')) return image;
    const index = (hotel.id - 1) % this.hotelImagePool.length;
    return this.hotelImagePool[index];
  }

  // ========================
  // Lightbox
  // ========================
  openLightbox(index: number): void {
    if (!this.hotel?.images?.length) return;
    this.selectedImageIndex = index;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.showLightbox = false;
    document.body.style.overflow = 'auto';
  }

  prevImage(): void {
    if (this.hotel?.images?.length) {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.hotel.images.length) % this.hotel.images.length;
    }
  }

  nextImage(): void {
    if (this.hotel?.images?.length) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.hotel.images.length;
    }
  }

  // ========================
  // Booking
  // ========================
  onDatesChange(): void {
    if (this.checkin && this.checkout && this.roomType) {
      this.calculateTotal();
    } else {
      this.totalPrice = 0;
    }
  }

  onRoomChange(): void {
    if (this.roomType && this.hotel?.rooms) {
      this.selectedRoom = this.hotel.rooms.find((r: any) => r.type === this.roomType);
      if (this.checkin && this.checkout) {
        this.calculateTotal();
      }
    } else {
      this.selectedRoom = null;
      this.totalPrice = 0;
    }
  }

  calculateTotal(): void {
    const checkinDate = new Date(this.checkin);
    const checkoutDate = new Date(this.checkout);
    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (this.selectedRoom) {
      this.totalPrice = this.selectedRoom.price * this.nights;
    } else {
      this.totalPrice = 0;
    }
  }

  checkAvailability(): void {
    if (!this.checkin || !this.checkout || !this.roomType) {
      alert('❌ Пожалуйста, заполните все поля.');
      return;
    }
    if (this.checkin < this.minDate) {
      alert('❌ Дата заезда не может быть в прошлом.');
      return;
    }
    if (this.checkout <= this.checkin) {
      alert('❌ Дата выезда должна быть позже даты заезда.');
      return;
    }
    this.calculateTotal();
    if (this.totalPrice > 0) {
      alert(`✅ Доступно! Общая стоимость: ${this.totalPrice}€ за ${this.nights} ночь(и).`);
    } else {
      alert('❌ Пожалуйста, выберите номер.');
    }
  }

  confirmBooking(): void {
    if (!this.authService.getToken()) {
      alert('🔒 Пожалуйста, войдите в систему, чтобы забронировать.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.checkin || !this.checkout || !this.roomType || !this.selectedRoom) {
      alert('❌ Пожалуйста, проверьте наличие перед бронированием.');
      return;
    }
    this.showPaymentModal = true;
  }

  processPayment(): void {
    const hotelCity = this.hotel.location ? this.hotel.location.split(',')[0].trim() : '';

    const bookingData = {
      hotelId: this.hotel.id,
      hotelName: this.hotel.name,
      hotelCity: hotelCity,
      roomType: this.roomType,
      checkIn: this.checkin,
      checkOut: this.checkout,
      guests: this.guests,
      nights: this.nights,
      pricePerNight: this.selectedRoom.price,
      totalPrice: this.totalPrice,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentMethod === 'cash' ? 'pending_at_arrival' : 'paid'
    };

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({ ...bookingData, id: Date.now() });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert(`🎉 Бронирование подтверждено! Оплата ${this.paymentMethod === 'cash' ? 'при заезде' : 'банковской картой'}.`);
    this.router.navigate(['/profile/bookings']);
    this.showPaymentModal = false;
  }

  bookRoom(roomType: string): void {
    this.roomType = roomType;
    this.onRoomChange();
    if (this.checkin && this.checkout && this.selectedRoom) {
      this.checkAvailability();
    } else {
      alert('📅 Пожалуйста, выберите даты.');
    }
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');
    return stars;
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/800x600?text=Изображение+недоступно';
  }
}