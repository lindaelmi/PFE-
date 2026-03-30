import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  continent: string;
  rooms?: Room[];
  reviews?: Review[];
}

export interface Room {
  id: number;
  hotelId: number;
  type: string;
  description: string;
  price: number;
  capacity: number;
  features: string[];
  available: boolean;
}

export interface Review {
  id: number;
  hotelId: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface AvailabilityRequest {
  hotelId: number;
  roomType: string;
  checkin: string;
  checkout: string;
  guests: number;
}

export interface AvailabilityResponse {
  available: boolean;
  message: string;
  totalPrice: number;
  nights: number;
}

export interface SearchFilters {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  continent?: string;
  checkin?: string;
  checkout?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:3000/api'; // URL вашего бэкенда NestJS

  constructor(private http: HttpClient) { }

  /**
   * Получить все отели
   */
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels`);
  }

  /**
   * Получить отель по ID
   */
  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}`);
  }

  /**
   * Проверить доступность номера
   */
  checkAvailability(request: AvailabilityRequest): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(`${this.apiUrl}/availability`, request);
  }

  /**
   * Получить список континентов
   */
  getContinents(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/continents`);
  }

  /**
   * Поиск отелей с фильтрами
   */
  searchHotels(filters: SearchFilters): Observable<Hotel[]> {
    return this.http.post<Hotel[]>(`${this.apiUrl}/hotels/search`, filters);
  }

  /**
   * Получить номера отеля
   */
  getHotelRooms(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotels/${hotelId}/rooms`);
  }

  /**
   * Получить отзывы об отеле
   */
  getHotelReviews(hotelId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/hotels/${hotelId}/reviews`);
  }

  /**
   * Резервные данные для разработки
   */
  getFallbackHotels(): Hotel[] {
    return [
      {
        id: 1,
        name: 'Отель Люкс Париж',
        location: 'Париж, Франция',
        description: 'Роскошный отель в самом сердце Парижа с великолепным видом на Эйфелеву башню.',
        rating: 4.8,
        pricePerNight: 300,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Бесплатный Wi-Fi', 'Бассейн', 'Спа', 'Ресторан'],
        continent: 'Европа'
      },
      {
        id: 2,
        name: 'Курорт Тропический Бали',
        location: 'Бали, Индонезия',
        description: 'Опыт тропического курорта с частными виллами и собственным пляжем.',
        rating: 4.9,
        pricePerNight: 450,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Частный пляж', 'Спа', 'Бесплатный Wi-Fi', 'Завтрак включен'],
        continent: 'Азия'
      },
      {
        id: 3,
        name: 'Отель Нью-Йорк Скайлайн',
        location: 'Нью-Йорк, США',
        description: 'Современный отель с потрясающим видом на Манхэттен и Центральный парк.',
        rating: 4.7,
        pricePerNight: 400,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Бесплатный Wi-Fi', 'Тренажерный зал', 'Обслуживание в номерах 24/7', 'Бар на крыше'],
        continent: 'Америка'
      },
      {
        id: 4,
        name: 'Сафари Лодж Кения',
        location: 'Найроби, Кения',
        description: 'Роскошный лодж в самом сердце заповедника для уникального сафари-опыта.',
        rating: 4.6,
        pricePerNight: 350,
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Сафари включено', 'Натуральный бассейн', 'Гастрономический ресторан', 'Экскурсии с гидом'],
        continent: 'Африка'
      },
      {
        id: 5,
        name: 'Пляжный курорт Сидней',
        location: 'Сидней, Австралия',
        description: 'Курорт прямо у пляжа с прямым выходом к морю и видом на оперный театр.',
        rating: 4.8,
        pricePerNight: 420,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Частный пляж', 'Спа', 'Водные виды спорта', 'Детский клуб'],
        continent: 'Океания'
      },
      {
        id: 6,
        name: 'Альпийский шале Швейцария',
        location: 'Церматт, Швейцария',
        description: 'Традиционное швейцарское шале с видом на Маттерхорн и прямым доступом к горнолыжным трассам.',
        rating: 4.9,
        pricePerNight: 500,
        imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Спа-зона', 'Сауна', 'Ресторан с мишленовскими звездами', 'Прямой доступ к трассам'],
        continent: 'Европа'
      }
    ];
  }

  /**
   * Резервные данные для деталей отеля
   */
  getFallbackHotelDetails(id: number): Hotel {
    const fallbackHotels: { [key: number]: Hotel } = {
      1: {
        id: 1,
        name: 'Отель Люкс Париж',
        location: 'Париж, Франция',
        description: 'Роскошный 5-звездочный отель, расположенный в самом сердце Парижа, с великолепным видом на Эйфелеву башню и Елисейские поля. С исключительным сервисом и первоклассными удобствами этот отель обещает незабываемое пребывание.',
        rating: 4.8,
        pricePerNight: 300,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Бесплатный Wi-Fi', 'Бассейн', 'Спа', 'Ресторан', 'Круглосуточное обслуживание номеров', 'Тренажерный зал', 'Парковка', 'Кондиционер'],
        continent: 'Европа',
        rooms: [
          {
            id: 1,
            hotelId: 1,
            type: 'Улучшенный номер',
            description: 'Просторный номер с видом на город',
            price: 300,
            capacity: 2,
            features: ['Кровать King Size', 'Плоский телевизор', 'Мини-бар', 'Отдельная ванная комната'],
            available: true
          },
          {
            id: 2,
            hotelId: 1,
            type: 'Младший люкс',
            description: 'Люкс с отдельной гостиной и видом на Эйфелеву башню',
            price: 450,
            capacity: 2,
            features: ['Кровать King Size', 'Отдельная гостиная', 'Частная терраса', 'Джакузи'],
            available: true
          },
          {
            id: 3,
            hotelId: 1,
            type: 'Президентский люкс',
            description: 'Роскошный люкс с обслуживанием дворецкого',
            price: 800,
            capacity: 4,
            features: ['Две спальни', 'Просторная гостиная', 'Оборудованная кухня', 'Услуги дворецкого'],
            available: true
          }
        ],
        reviews: [
          {
            id: 1,
            hotelId: 1,
            author: 'Мари Дюбуа',
            date: '15/01/2024',
            rating: 5,
            comment: 'Исключительное пребывание! Обслуживание было безупречным, а вид на Эйфелеву башню захватывал дух.',
            avatar: 'М'
          },
          {
            id: 2,
            hotelId: 1,
            author: 'Тома Мартен',
            date: '10/01/2024',
            rating: 4,
            comment: 'Очень красивый отель с современным оснащением. Завтрак был восхитительным.',
            avatar: 'Т'
          },
          {
            id: 3,
            hotelId: 1,
            author: 'Софи Леруа',
            date: '05/01/2024',
            rating: 5,
            comment: 'Идеальный опыт для романтического уик-энда. Мы вернемся!',
            avatar: 'С'
          }
        ]
      },
      2: {
        id: 2,
        name: 'Курорт Тропический Бали',
        location: 'Бали, Индонезия',
        description: 'Опыт тропического курорта с частными виллами и собственным пляжем. Наслаждайтесь солнцем, морем и белым песком в этом тропическом раю.',
        rating: 4.9,
        pricePerNight: 450,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Частный пляж', 'Спа', 'Бесплатный Wi-Fi', 'Завтрак включен', 'Бесконечный бассейн', 'Утренняя йога', 'Экскурсии включены'],
        continent: 'Азия',
        rooms: [
          {
            id: 4,
            hotelId: 2,
            type: 'Стандартная вилла',
            description: 'Вилла с частной террасой и тропическим садом',
            price: 450,
            capacity: 2,
            features: ['Двуспальная кровать', 'Частная терраса', 'Наружная ванная комната', 'Мини-кухня'],
            available: true
          },
          {
            id: 5,
            hotelId: 2,
            type: 'Вилла Делюкс',
            description: 'Вилла с частным бассейном и видом на океан',
            price: 650,
            capacity: 4,
            features: ['Две спальни', 'Частный бассейн', 'Оборудованная кухня', 'Ежедневное обслуживание'],
            available: true
          }
        ],
        reviews: [
          {
            id: 4,
            hotelId: 2,
            author: 'Жан Дюпон',
            date: '20/01/2024',
            rating: 5,
            comment: 'Настоящий рай на земле! Виллы великолепны, а персонал очарователен.',
            avatar: 'Ж'
          }
        ]
      }
    };

    return fallbackHotels[id] || fallbackHotels[1];
  }

  /**
   * Симуляция локальной проверки доступности (запасной вариант)
   */
  simulateLocalAvailability(request: AvailabilityRequest): AvailabilityResponse {
    // Простая симуляция: 80% вероятность доступности
    const available = Math.random() > 0.2;
    
    const checkinDate = new Date(request.checkin);
    const checkoutDate = new Date(request.checkout);
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));
    
    // Фиктивная цена на основе типа номера
    const basePrice = request.roomType.includes('Люкс') ? 500 : 
                     request.roomType.includes('Вилла') ? 600 : 
                     request.roomType.includes('Делюкс') ? 700 : 300;
    
    const totalPrice = basePrice * nights;
    
    return {
      available,
      message: available 
        ? `Номер доступен на ${nights} ночей` 
        : 'Извините, этот номер недоступен на выбранные даты.',
      totalPrice,
      nights
    };
  }
}