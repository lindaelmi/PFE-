import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TransportService } from './transport.service';
import { Transport } from './transport.model';

@Component({
  selector: 'app-transport-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss']
})
export class TransportDetailsComponent implements OnInit {
  transport: Transport | null = null;
  isLoading = true;
  errorMessage = '';

  // Réservation
  passengers = 1;
  isBooking = false;
  bookingSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transportService: TransportService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTransport(id);
    } else {
      this.errorMessage = 'Transport non trouvé';
      this.isLoading = false;
    }
  }

  loadTransport(id: number): void {
    this.transportService.getTransportById(id).subscribe({
      next: (transport) => {
        if (transport) {
          this.transport = transport;
        } else {
          this.errorMessage = 'Transport non trouvé';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du transport';
        this.isLoading = false;
      }
    });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      avion: 'fas fa-plane',
      train: 'fas fa-train',
      bus: 'fas fa-bus',
      voiture: 'fas fa-car'
    };
    return icons[type] || 'fas fa-question';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      avion: 'Vol',
      train: 'Train',
      bus: 'Bus',
      voiture: 'Location'
    };
    return labels[type] || type;
  }

  bookTransport(): void {
    if (!this.transport) return;
    if (this.passengers < 1) this.passengers = 1;
    if (this.passengers > this.transport.availableSeats) {
      alert(`Il n'y a que ${this.transport.availableSeats} places disponibles.`);
      return;
    }

    this.isBooking = true;
    // Simuler un appel API de réservation
    setTimeout(() => {
      this.isBooking = false;
      this.bookingSuccess = true;
      // Rediriger après 2 secondes vers la page des réservations
      setTimeout(() => {
        this.router.navigate(['/reservations']);
      }, 2000);
    }, 1500);
  }

  goBack(): void {
    this.router.navigate(['/transports']);
  }
}