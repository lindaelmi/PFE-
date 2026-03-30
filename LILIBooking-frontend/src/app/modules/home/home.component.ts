import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MapComponent } from '../../shared/components/map/map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    MapComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookingTypes = [
    { label: 'Отель', value: 'hotel', icon: 'fa-bed' }
  ];

  searchData = {
    bookingType: 'hotel',
    destination: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1
  };

  showSuggestions = false;
  filteredDestinations: any[] = [];
  destinations: any[] = [];

  selectedContinent = 'Europe';
  dateError: string | null = null;

  // Avis clients en russe
  reviews = [
    { avatar: 'JD', name: 'Жан Дюпон', country: 'Франция', comment: 'Отличный опыт!', date: '15 января 2024', rating: 5 },
    { avatar: 'MS', name: 'Мари Симон', country: 'Бельгия', comment: 'Идеально организованная поездка.', date: '10 января 2024', rating: 5 },
    { avatar: 'TR', name: 'Томас Ришар', country: 'Швейцария', comment: 'Чистый и удобно расположенный отель.', date: '5 января 2024', rating: 4 }
  ];

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeDestinations();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.searchData.checkIn = this.formatDateForInput(today);
    this.searchData.checkOut = this.formatDateForInput(tomorrow);
  }

  /**
   * Retourne l'URL de l'image emblématique du pays.
   * Priorité aux images locales (dans assets/images/), sinon URL externe.
   */
  getDestinationImage(destination: any): string {
    // Mapping des pays vers les noms de fichiers locaux
    const localImages: { [key: string]: string } = {
      'ОАЭ': 'dubai.jfif',
      'Египет': 'egypt.png',
      'Индия': 'india.png',
      'Малайзия': 'kuala.png',
      'Марокко': 'maroco.png',
      'Китай': 'pekin.png',
      'Южная Корея': 'seoul.png',
      'Сингапур': 'singapore.png',
      'Япония': 'tokyo.png',
      'Тунис': 'tunis.png'
    };

    // Vérifier si une image locale existe pour ce pays
    const localFileName = localImages[destination.country];
    if (localFileName) {
      return `assets/images/${localFileName}`;
    }

    // Sinon, utiliser les URLs externes (mêmes que précédemment)
    const externalImages: { [key: string]: string } = {
      // Europe
      'Франция': 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Италия': 'https://images.pexels.com/photos/3532559/pexels-photo-3532559.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Испания': 'https://images.pexels.com/photos/401496/pexels-photo-401496.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Великобритания': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Нидерланды': 'https://images.pexels.com/photos/408503/pexels-photo-408503.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Германия': 'https://images.pexels.com/photos/220444/pexels-photo-220444.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Португалия': 'https://images.pexels.com/photos/3370842/pexels-photo-3370842.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Чехия': 'https://images.pexels.com/photos/353453/pexels-photo-353453.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Греция': 'https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      // Asie
      'Таиланд': 'https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'Вьетнам': 'https://images.pexels.com/photos/1568634/pexels-photo-1568634.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      // Afrique
      'Танзания': 'https://images.pexels.com/photos/405152/pexels-photo-405152.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    };

    const imageUrl = externalImages[destination.country];
    if (imageUrl) {
      return imageUrl;
    }

    // Fallback générique
    return `https://via.placeholder.com/800x600?text=${encodeURIComponent(destination.name)}`;
  }

  private initializeDestinations(): void {
    this.destinations = [
      // EUROPE
      { name: 'Paris', country: 'Франция', continent: 'Europe', description: 'Город огней', popularActivities: ['Эйфелева башня', 'Лувр', 'Сена'], hotelCount: 245, averagePrice: 150 },
      { name: 'Rome', country: 'Италия', continent: 'Europe', description: 'Вечный город', popularActivities: ['Колизей', 'Ватикан', 'Фонтан Треви'], hotelCount: 312, averagePrice: 140 },
      { name: 'Barcelone', country: 'Испания', continent: 'Europe', description: 'Каталонская столица', popularActivities: ['Саграда Фамилия', 'Парк Гуэль', 'Рамбла'], hotelCount: 278, averagePrice: 135 },
      { name: 'Londres', country: 'Великобритания', continent: 'Europe', description: 'Космополитичный мегаполис', popularActivities: ['Биг-Бен', 'Лондонский глаз', 'Букингемский дворец'], hotelCount: 420, averagePrice: 180 },
      { name: 'Amsterdam', country: 'Нидерланды', continent: 'Europe', description: 'Северная Венеция', popularActivities: ['Каналы', 'Музей Ван Гога', 'Дом Анны Франк'], hotelCount: 190, averagePrice: 125 },
      { name: 'Berlin', country: 'Германия', continent: 'Europe', description: 'Исторический и современный город', popularActivities: ['Берлинская стена', 'Бранденбургские ворота', 'Музейный остров'], hotelCount: 235, averagePrice: 110 },
      { name: 'Lisbonne', country: 'Португалия', continent: 'Europe', description: 'Легкость бытия', popularActivities: ['Трамвай 28', 'Башня Белен', 'Алфама'], hotelCount: 150, averagePrice: 100 },
      { name: 'Athènes', country: 'Греция', continent: 'Europe', description: 'Колыбель цивилизации', popularActivities: ['Акрополь', 'Парфенон', 'Плака'], hotelCount: 140, averagePrice: 95 },
      // ASIE
      { name: 'Tokyo', country: 'Япония', continent: 'Asie', description: 'Футуристический мегаполис', popularActivities: ['Сибуя', 'Сэнсо-дзи', 'Храм Мэйдзи'], hotelCount: 198, averagePrice: 180 },
      { name: 'Bangkok', country: 'Таиланд', continent: 'Asie', description: 'Экзотическая столица', popularActivities: ['Королевский дворец', 'Плавучие рынки', 'Ват Пхо'], hotelCount: 275, averagePrice: 90 },
      { name: 'Singapour', country: 'Сингапур', continent: 'Asie', description: 'Футуристический сад', popularActivities: ['Сады у залива', 'Marina Bay Sands', 'Сентоза'], hotelCount: 210, averagePrice: 160 },
      { name: 'Dubaï', country: 'ОАЭ', continent: 'Asie', description: 'Город роскоши', popularActivities: ['Бурдж-Халифа', 'Дубай Молл', 'Пустыня'], hotelCount: 350, averagePrice: 220 },
      { name: 'Séoul', country: 'Южная Корея', continent: 'Asie', description: 'Динамизм и традиции', popularActivities: ['Дворец Кёнбоккун', 'Мёндон', 'Сеульская башня'], hotelCount: 180, averagePrice: 120 },
      { name: 'Pékin', country: 'Китай', continent: 'Asie', description: 'Запретный город', popularActivities: ['Запретный город', 'Великая Китайская стена', 'Храм Неба'], hotelCount: 310, averagePrice: 110 },
      { name: 'Kuala Lumpur', country: 'Малайзия', continent: 'Asie', description: 'Башни-близнецы', popularActivities: ['Петронас', 'Пещеры Бату', 'Букит Бинтанг'], hotelCount: 160, averagePrice: 85 },
      { name: 'Mumbai', country: 'Индия', continent: 'Asie', description: 'Болливуд и Ворота Индии', popularActivities: ['Ворота Индии', 'Марин-Драйв', 'Храмы'], hotelCount: 190, averagePrice: 100 },
      // AFRIQUE
      { name: 'Marrakech', country: 'Марокко', continent: 'Afrique', description: 'Жемчужина юга', popularActivities: ['Медина', 'Сады Мажорель', 'Площадь Джемаа-эль-Фна'], hotelCount: 150, averagePrice: 110 },
      { name: 'Le Caire', country: 'Египет', continent: 'Afrique', description: 'Город фараонов', popularActivities: ['Пирамиды', 'Сфинкс', 'Египетский музей'], hotelCount: 187, averagePrice: 130 },
      { name: 'Tunis', country: 'Тунис', continent: 'Afrique', description: 'Средиземноморье и Карфаген', popularActivities: ['Руины Карфагена', 'Сиди-Бу-Саид', 'Медина'], hotelCount: 95, averagePrice: 80 },
    ];
    this.destinations.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
  }

  filterByContinent(continent: string): void {
    this.selectedContinent = continent;
  }

  get filteredDestinationsByContinent(): any[] {
    return this.destinations.filter(d => d.continent === this.selectedContinent);
  }

  viewOffers(destination: any): void {
    this.router.navigate(['/search'], {
      queryParams: {
        destination: destination.name,
        checkIn: this.searchData.checkIn,
        checkOut: this.searchData.checkOut,
        adults: this.searchData.adults,
        children: this.searchData.children,
        rooms: this.searchData.rooms,
        type: 'hotel'
      }
    });
  }

  onDestinationSearch(event: any): void {
    const searchTerm = event.target.value;
    if (searchTerm && searchTerm.trim().length > 0) {
      this.filteredDestinations = this.destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.showSuggestions = this.filteredDestinations.length > 0;
    } else {
      this.filteredDestinations = [];
      this.showSuggestions = false;
    }
  }

  selectDestination(destination: any): void {
    this.searchData.destination = destination.name;
    this.filteredDestinations = [];
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => { this.showSuggestions = false; }, 200);
  }

  search(): void {
    this.dateError = null;
    if (!this.searchData.checkIn || !this.searchData.checkOut) {
      this.dateError = 'Пожалуйста, выберите даты заезда и выезда.';
      return;
    }
    const checkInDate = new Date(this.searchData.checkIn);
    const checkOutDate = new Date(this.searchData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      this.dateError = 'Дата заезда не может быть в прошлом.';
      return;
    }
    if (checkOutDate <= checkInDate) {
      this.dateError = 'Дата выезда должна быть позже даты заезда.';
      return;
    }
    const cityOnly = this.searchData.destination.split(',')[0].trim();
    this.router.navigate(['/search'], {
      queryParams: {
        destination: cityOnly,
        checkIn: this.searchData.checkIn,
        checkOut: this.searchData.checkOut,
        adults: this.searchData.adults,
        children: this.searchData.children,
        rooms: this.searchData.rooms,
        type: 'hotel'
      }
    });
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getReviewStars(rating: number): { full: number; empty: number } {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return { full, empty };
  }

  trackByDestinationName(index: number, destination: any): string { return destination?.name + destination?.country || index.toString(); }
  trackByReviewName(index: number, review: any): string { return review?.name || index.toString(); }
}