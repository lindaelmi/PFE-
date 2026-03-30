import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { excursions } from '../../core/data/excursions';

@Component({
  selector: 'app-excursion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5" *ngIf="excursion">
      <div class="row">
        <div class="col-md-6">
          <img [src]="excursion.image" class="img-fluid rounded" [alt]="excursion.name">
        </div>
        <div class="col-md-6">
          <h1>{{ excursion.name }}</h1>
          <div class="mb-2">
            <span class="badge bg-info me-2">{{ excursion.category }}</span>
            <span class="badge bg-secondary">{{ excursion.duration }}</span>
          </div>
          <div class="mb-3">
            <i class="fas fa-map-marker-alt text-danger"></i> {{ excursion.location }}
          </div>
          <p>{{ excursion.description }}</p>
          <h3 class="text-primary">{{ excursion.price }}€</h3>
          <div class="mb-3">
            <strong>Note :</strong>
            <ng-container *ngIf="getReviewStars(excursion.rating) as stars">
              <i class="fas fa-star text-warning" *ngFor="let s of [].constructor(stars.full)"></i>
              <i class="far fa-star text-warning" *ngFor="let s of [].constructor(stars.empty)"></i>
            </ng-container>
          </div>
          <div *ngIf="excursion.included">
            <h5>Ce qui est inclus :</h5>
            <ul>
              <li *ngFor="let item of excursion.included">{{ item }}</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-lg me-2" (click)="book()">Réserver maintenant</button>
          <button class="btn btn-outline-secondary btn-lg" routerLink="/">Retour</button>
        </div>
      </div>
    </div>
    <div *ngIf="!excursion" class="text-center py-5">
      <p>Excursion non trouvée</p>
    </div>
  `,
  styles: []
})
export class ExcursionDetailComponent implements OnInit {
  excursion: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.excursion = excursions.find(e => e.id === id);
  }

  getReviewStars(rating: number): { full: number; empty: number } {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return { full, empty };
  }

  book(): void {
    // Rediriger vers la page de réservation
    console.log('Réserver', this.excursion);
    // Exemple : this.router.navigate(['/booking'], { queryParams: { type: 'excursion', id: this.excursion.id } });
  }
}