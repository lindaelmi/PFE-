import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Excursion } from './excursion.model';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private mockExcursions: Excursion[] = [
    {
      id: 1,
      title: 'Visite du Louvre',
      location: 'Paris',
      country: 'France',
      duration: '3 heures',
      price: 45,
      rating: 4.8,
      reviewCount: 1250,
      image: 'https://images.unsplash.com/photo-1569919338781-219b081d1e6b?w=500',
      category: 'Culture',
      included: ['Guide', 'Billet coupe-file', 'Audioguide'],
      description: 'Découvrez les chefs-d’œuvre du plus grand musée du monde.',
      available: true
    },
    {
      id: 2,
      title: 'Dégustation de vins à Bordeaux',
      location: 'Bordeaux',
      country: 'France',
      duration: '2 heures',
      price: 35,
      rating: 4.9,
      reviewCount: 890,
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500',
      category: 'Gastronomie',
      included: ['5 vins à déguster', 'Planche de fromages', 'Œnologue'],
      description: 'Initiez-vous aux secrets des grands crus bordelais.',
      available: true
    },
    {
      id: 3,
      title: 'Randonnée au Mont Blanc',
      location: 'Chamonix',
      country: 'France',
      duration: 'Journée complète',
      price: 89,
      rating: 4.7,
      reviewCount: 560,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      category: 'Nature',
      included: ['Guide de montagne', 'Pique-nique', 'Bâtons de marche'],
      description: 'Une journée inoubliable au cœur des Alpes.',
      available: true
    },
    {
      id: 4,
      title: 'Croisière sur la Seine',
      location: 'Paris',
      country: 'France',
      duration: '1 heure',
      price: 15,
      rating: 4.5,
      reviewCount: 2100,
      image: 'https://images.unsplash.com/photo-1508050919630-b135583b29ab?w=500',
      category: 'Détente',
      included: ['Commentaire en direct', 'Boisson offerte'],
      description: 'Admirez les monuments parisiens depuis la Seine.',
      available: true
    },
    {
      id: 5,
      title: 'Cours de cuisine italienne',
      location: 'Rome',
      country: 'Italie',
      duration: '4 heures',
      price: 75,
      rating: 4.9,
      reviewCount: 430,
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
      category: 'Gastronomie',
      included: ['Ingrédients', 'Repas', 'Recettes'],
      description: 'Apprenez à faire des pâtes fraîches et tiramisu.',
      available: true
    },
    {
      id: 6,
      title: 'Safari au Kenya',
      location: 'Masai Mara',
      country: 'Kenya',
      duration: '3 jours',
      price: 650,
      rating: 5.0,
      reviewCount: 320,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500',
      category: 'Aventure',
      included: ['Hébergement', 'Repas', 'Safaris quotidiens'],
      description: 'Vivez un safari exceptionnel au cœur de la savane.',
      available: true
    }
  ];

  getAllExcursions(): Observable<Excursion[]> {
    return of(this.mockExcursions);
  }

  getExcursionById(id: number): Observable<Excursion | undefined> {
    return of(this.mockExcursions.find(e => e.id === id));
  }

  getCategories(): string[] {
    return [...new Set(this.mockExcursions.map(e => e.category))];
  }

  getDurations(): string[] {
    return [...new Set(this.mockExcursions.map(e => e.duration))];
  }
}