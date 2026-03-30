import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ExcursionService } from './excursion.service';   // <- chemin relatif correct
import { Excursion } from './excursion.model';           // <- chemin relatif correct

@Component({
  selector: 'app-excursions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './excursions.component.html',
  styleUrls: ['./excursions.component.scss']
})
export class ExcursionsComponent implements OnInit {
  // Données
  allExcursions: Excursion[] = [];
  filteredExcursions: Excursion[] = [];
  paginatedExcursions: Excursion[] = [];

  // Filtres
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedDuration: string = '';
  maxPrice: number = 0;
  sortBy: string = 'title';

  // Options pour les filtres
  categories: string[] = [];
  durations: string[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(private excursionService: ExcursionService) {}

  ngOnInit(): void {
    this.loadExcursions();
  }

  loadExcursions(): void {
    this.excursionService.getAllExcursions().subscribe((data: Excursion[]) => { // typage explicite
      this.allExcursions = data;
      this.categories = this.excursionService.getCategories();
      this.durations = this.excursionService.getDurations();
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // 1. Filtrer
    let filtered = this.allExcursions.filter((exc) => {
      const matchesSearch =
        !this.searchTerm ||
        exc.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        exc.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        exc.country.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory || exc.category === this.selectedCategory;
      const matchesDuration = !this.selectedDuration || exc.duration === this.selectedDuration;
      const matchesPrice = this.maxPrice === 0 || exc.price <= this.maxPrice;

      return matchesSearch && matchesCategory && matchesDuration && matchesPrice;
    });

    // 2. Trier
    filtered = this.sortExcursions(filtered, this.sortBy);

    this.filteredExcursions = filtered;
    this.totalPages = Math.ceil(this.filteredExcursions.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    this.updatePaginatedList();
  }

  sortExcursions(excursions: Excursion[], sortBy: string): Excursion[] {
    const sorted = [...excursions];
    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }

  updatePaginatedList(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedExcursions = this.filteredExcursions.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }
}