import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  criteria = {
    destination: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    type: 'hotel'
  };

  hotels: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Mapping des noms de destinations (français ↔ russe)
  private destinationMapping: { [key: string]: string } = {
    'Paris': 'Париж',
    'Londres': 'Лондон',
    'Rome': 'Рим',
    'Barcelone': 'Барселона',
    'Amsterdam': 'Амстердам',
    'Berlin': 'Берлин',
    'Prague': 'Прага',
    'Vienne': 'Вена',
    'Athènes': 'Афины',
    'Lisbonne': 'Лиссабон',
    'Tokyo': 'Токио',
    'Bangkok': 'Бангкок',
    'Singapour': 'Сингапур',
    'Dubai': 'Дубай',
    'Séoul': 'Сеул',
    'Pékin': 'Пекин',
    'Mumbai': 'Мумбаи',
    'Marrakech': 'Марракеш',
    'Le Caire': 'Каир',
    'Tunis': 'Тунис',
    'Zanzibar': 'Занзибар',
    'Париж': 'Paris',
    'Лондон': 'Londres',
    'Рим': 'Rome',
    'Барселона': 'Barcelone',
    'Амстердам': 'Amsterdam',
    'Берлин': 'Berlin',
    'Прага': 'Prague',
    'Вена': 'Vienne',
    'Афины': 'Athènes',
    'Лиссабон': 'Lisbonne',
    'Токио': 'Tokyo',
    'Бангкок': 'Bangkok',
    'Сингапур': 'Singapour',
    'Дубай': 'Dubai',
    'Сеул': 'Séoul',
    'Пекин': 'Pékin',
    'Мумбаи': 'Mumbai',
    'Марракеш': 'Marrakech',
    'Каир': 'Le Caire',
    'Тунис': 'Tunis',
    'Занзибар': 'Zanzibar'
  };

  // Traduction des noms d’hôtels (français/anglais → russe)
  private hotelNameTranslations: { [key: string]: string } = {
    'Hotel Plaza Athénée': 'Отель Плаза Атене',
    'Le Bristol Paris': 'Отель Ле Бристоль',
    'Ritz Paris': 'Риц Париж',
    'Shangri-La Paris': 'Шангри-Ла Париж',
    'Four Seasons George V': 'Фор Сизанс Жорж V',
    'The Peninsula Paris': 'Отель Пенинсула Париж',
    'Hotel Lutetia': 'Отель Лютеция',
    'Hôtel de Crillon': 'Отель де Крийон',
    'InterContinental Paris Le Grand': 'Интерконтиненталь Париж Ле Гран',
    'Sofitel Paris Arc de Triomphe': 'Софитель Париж Триумфальная арка',
    // Ajoutez ici les traductions pour vos hôtels
  };

  // Images de secours (thématiques)
  private fallbackImages: string[] = [
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
  ];

  // Mapping des villes vers les images locales (si existantes)
  private cityImages: { [key: string]: string } = {
    'Paris': 'assets/images/paris.jpg',
    'Rome': 'assets/images/rome.jpg',
    'Barcelone': 'assets/images/barcelona.jpg',
    'Londres': 'assets/images/london.jpg',
    'Amsterdam': 'assets/images/amsterdam.jpg',
    'Berlin': 'assets/images/berlin.jpg',
    'Tokyo': 'assets/images/tokyo.png',
    'Dubai': 'assets/images/dubai.jfif',
    'Singapour': 'assets/images/singapore.png',
    'Séoul': 'assets/images/seoul.png',
    'Pékin': 'assets/images/pekin.png',
    'Mumbai': 'assets/images/india.png',
    'Marrakech': 'assets/images/maroco.png',
    'Le Caire': 'assets/images/egypt.png',
    'Tunis': 'assets/images/tunis.png',
    'Zanzibar': 'assets/images/zanzibar.jpg',
    'Kuala Lumpur': 'assets/images/kuala.png'
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let destination = params['destination'] || '';
      const normalizedDestination = this.normalizeDestination(destination);
      this.criteria = {
        destination: normalizedDestination,
        checkIn: params['checkIn'] || '',
        checkOut: params['checkOut'] || '',
        adults: +params['adults'] || 1,
        children: +params['children'] || 0,
        rooms: +params['rooms'] || 1,
        type: params['type'] || 'hotel'
      };
      this.searchHotels();
    });
  }

  private normalizeDestination(dest: string): string {
    if (!dest) return '';
    if (this.destinationMapping[dest]) {
      return this.destinationMapping[dest];
    }
    return dest;
  }

  searchHotels(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.searchHotels(this.criteria).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.hotels = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur recherche:', err);
        this.errorMessage = 'Не удалось загрузить результаты.';
        this.cdr.detectChanges();
      }
    });
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  formatPrice(price: number): string {
    return price ? price.toFixed(2) : '0.00';
  }

  getHotelImage(hotel: any): string {
    // 1. Image fournie par l'API
    if (hotel.imageUrl) return hotel.imageUrl;
    if (hotel.image) return hotel.image;
    if (hotel.images && hotel.images[0]) return hotel.images[0];

    // 2. Image locale basée sur la ville
    const cityKey = hotel.city;
    if (cityKey && this.cityImages[cityKey]) {
      return this.cityImages[cityKey];
    }

    // 3. Image de secours basée sur l'ID
    if (hotel.id) {
      const index = (hotel.id - 1) % this.fallbackImages.length;
      return this.fallbackImages[index];
    }

    // 4. Dernier recours : SVG généré
    const colors: Record<string, string> = {
      'Europe': '#4A90E2',
      'Asie': '#FF6B6B',
      'Afrique': '#FFD700',
      'Amérique': '#20B2AA',
      'Océanie': '#9370DB',
      'default': '#CCCCCC'
    };
    const color = colors[hotel.continent] || colors['default'];
    const text = hotel.continent || 'Hôtel';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="${color}" rx="10" ry="10"/>
      <path d="M100,100 L150,50 L250,50 L300,100 Z" fill="white" fill-opacity="0.3"/>
      <rect x="120" y="100" width="60" height="50" fill="white" fill-opacity="0.4"/>
      <rect x="220" y="100" width="60" height="50" fill="white" fill-opacity="0.4"/>
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">${text}</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  getHotelName(hotel: any): string {
    return this.hotelNameTranslations[hotel.name] || hotel.name;
  }

  getCityName(city: string): string {
    return this.destinationMapping[city] || city;
  }

  addToFavorites(hotel: any): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.find((fav: any) => fav.id === hotel.id)) {
      favorites.push({ id: hotel.id, name: hotel.name, city: hotel.city, price: hotel.pricePerNight });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${hotel.name} добавлен в избранное!`);
    } else {
      alert(`${hotel.name} уже в избранном.`);
    }
  }

  trackByHotelId(index: number, hotel: any): number {
    return hotel.id;
  }
}