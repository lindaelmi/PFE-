import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TransportService } from './transport.service';
import { Transport } from './transport.model';

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss']
})
export class TransportsComponent implements OnInit {
  // Données
  allTransports: Transport[] = [];
  filteredTransports: Transport[] = [];
  paginatedTransports: Transport[] = [];

  // Filtres
  searchTerm: string = '';
  selectedType: string = '';
  selectedCompany: string = '';
  maxPrice: number = 0;
  sortBy: string = 'departure';

  // Options pour les filtres
  transportTypes: string[] = [];
  companies: string[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;

  constructor(private transportService: TransportService) {}

  ngOnInit(): void {
    this.loadTransports();
  }

  loadTransports(): void {
    this.transportService.getAllTransports().subscribe((data: Transport[]) => {
      this.allTransports = data;
      this.transportTypes = this.transportService.getTransportTypes();
      this.companies = this.transportService.getCompanies();
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // 1. Filtrer
    let filtered = this.allTransports.filter((transport) => {
      const matchesSearch =
        !this.searchTerm ||
        transport.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transport.departureCity.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transport.arrivalCity.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || transport.type === this.selectedType;
      const matchesCompany = !this.selectedCompany || transport.company === this.selectedCompany;
      const matchesPrice = this.maxPrice === 0 || transport.price <= this.maxPrice;

      return matchesSearch && matchesType && matchesCompany && matchesPrice;
    });

    // 2. Trier
    filtered = this.sortTransports(filtered, this.sortBy);

    this.filteredTransports = filtered;
    this.totalPages = Math.ceil(this.filteredTransports.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    this.updatePaginatedList();
  }

  sortTransports(transports: Transport[], sortBy: string): Transport[] {
    const sorted = [...transports];
    switch (sortBy) {
      case 'departure':
        sorted.sort((a, b) => a.departureCity.localeCompare(b.departureCity));
        break;
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        sorted.sort((a, b) => {
          // Convertir durée en minutes pour comparaison
          const getMinutes = (dur: string) => {
            const parts = dur.split(' ');
            if (parts.length >= 2) {
              if (parts[1].includes('h')) {
                const h = parseInt(parts[0]);
                const m = parts.length > 2 ? parseInt(parts[2]) : 0;
                return h * 60 + m;
              }
            }
            return 0;
          };
          return getMinutes(a.duration) - getMinutes(b.duration);
        });
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return sorted;
  }

  updatePaginatedList(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransports = this.filteredTransports.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }
}