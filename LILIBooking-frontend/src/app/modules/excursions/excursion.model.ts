export interface Excursion {
  id: number;
  title: string;
  location: string;
  country: string;
  duration: string;      // ex: "3 heures", "Journée complète"
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;      // ex: "Culture", "Nature", "Gastronomie"
  included: string[];    // prestations incluses
  description: string;
  available: boolean;
}