import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ContactComponent } from './modules/contact/contact.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { MyBookingsComponent } from './modules/booking/my-bookings.component';
import { AdminLayoutComponent } from './modules/admin/layout/admin-layout.component'; // ← Import du layout
import { BookingComponent } from './modules/booking/booking.component';
export const routes: Routes = [
  // ----- Pages statiques -----
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Accueil - LILIBooking' }
  },
  {
    path: 'connexion',
    component: LoginComponent,
    data: { title: 'Connexion - LILIBooking' }
  },
  {
    path: 'inscription',
    component: RegisterComponent,
    data: { title: 'Inscription - LILIBooking' }
  },
  { path: 'bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'Contact - LILIBooking' }
  },

  // ----- Modules lazy-loadés -----
  {
    path: 'hotels',
    loadComponent: () => import('./modules/hotel/hotel-list/hotel-list.component')
      .then(m => m.HotelListComponent),
    data: { title: 'Hôtels - LILIBooking' }
  },
  {
    path: 'hotel/:id',
    loadComponent: () => import('./modules/hotel/hotel-details/hotel-details.component')
      .then(m => m.HotelDetailsComponent),
    data: { title: 'Détails Hôtel - LILIBooking' }
  },
  {
    path: 'excursions',
    loadComponent: () => import('./modules/excursions/excursions.component')
      .then(m => m.ExcursionsComponent),
    data: { title: 'Excursions - LILIBooking' }
  },
  {
    path: 'excursions/:id',
    loadComponent: () => import('./modules/excursions/excursion-details.component')
      .then(m => m.ExcursionDetailComponent),
    data: { title: 'Détail Excursion - LILIBooking' }
  },
  {
    path: 'transports',
    loadComponent: () => import('./modules/transports/transports.component')
      .then(m => m.TransportsComponent),
    data: { title: 'Transports - LILIBooking' }
  },
  {
    path: 'transports/:id',
    loadComponent: () => import('./modules/transports/transport-details.component')
      .then(m => m.TransportDetailsComponent),
    data: { title: 'Détail Transport - LILIBooking' }
  },
  {
    path: 'favorites',
    loadComponent: () => import('./modules/favorites/favorites.component')
      .then(m => m.FavoritesComponent),
    data: { title: 'Mes Favoris - LILIBooking' }
  },
  {
    path: 'search',
    loadComponent: () => import('./modules/search/search.component').then(m => m.SearchComponent)
  },

{
  path: 'booking/:id',
  loadComponent: () => import('./modules/booking/booking.component')
    .then(m => m.BookingComponent),
  canActivate: [AuthGuard], // facultatif, si réservation nécessite connexion
  data: { title: 'Réservation - LILIBooking' }
},
  // ----- Profil utilisateur (protégé) -----
  {
    path: 'profile',
    loadComponent: () => import('./modules/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    data: { title: 'Mon Profil - LILIBooking' }
  },

  // ----- Administration (protégée par AdminGuard) -----
  {
    path: 'admin',
    component: AdminLayoutComponent,  // ← Layout avec sidebar
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/admin/dashboard/dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/admin/users/users.component')
          .then(m => m.AdminUsersComponent)
      },
      {
        path: 'hotels',
        loadComponent: () => import('./modules/admin/hotels/hotels.component')
          .then(m => m.AdminHotelsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./modules/admin/bookings/bookings.component')
          .then(m => m.AdminBookingsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./modules/admin/reviews/reviews.component')
          .then(m => m.AdminReviewsComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./modules/admin/services/services.component')
          .then(m => m.AdminServicesComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ----- Redirections -----
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'accueil',
    redirectTo: '',
    pathMatch: 'full'
  },

  // ----- Fallback -----
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];