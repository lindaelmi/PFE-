import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg fixed-top" [class.scrolled]="isScrolled">
      <div class="container">
        <!-- Logo avec animation -->
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-hotel"></i>
          <span>LILIBooking</span>
        </a>

        <!-- Toggler mobile animé -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Переключить навигацию"
                [class.active]="isMenuOpen" (click)="toggleMenu()">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menu principal avec animation d'apparition -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-home"></i> Главная
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/hotels" routerLinkActive="active">
                <i class="fas fa-hotel"></i> Отели
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/contact" routerLinkActive="active">
                <i class="fas fa-envelope"></i> Контакты
              </a>
            </li>
          </ul>

          <!-- Menu utilisateur -->
          <ul class="navbar-nav">
            <ng-container *ngIf="!(authService.user$ | async)">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user-circle"></i> Аккаунт
                </a>
                <ul class="dropdown-menu dropdown-menu-end animate-slide" aria-labelledby="userDropdown">
                  <li><a class="dropdown-item" routerLink="/connexion"><i class="fas fa-sign-in-alt"></i> Вход</a></li>
                  <li><a class="dropdown-item" routerLink="/inscription"><i class="fas fa-user-plus"></i> Регистрация</a></li>
                </ul>
              </li>
            </ng-container>

            <ng-container *ngIf="authService.user$ | async as user">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user-circle"></i> {{ user.email }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end animate-slide" aria-labelledby="userDropdown">
                  <li><a class="dropdown-item" routerLink="/profile"><i class="fas fa-id-card"></i> Мой профиль</a></li>
                  <li><a class="dropdown-item" routerLink="/favorites"><i class="fas fa-heart"></i> Избранное</a></li>
                  <li><a class="dropdown-item" routerLink="/bookings"><i class="fas fa-calendar-alt"></i> Мои бронирования</a></li>
                  <li *ngIf="user.role === 'admin'"><hr class="dropdown-divider"></li>
                  <li *ngIf="user.role === 'admin'" class="dropdown-header">Администрирование</li>
                  <li *ngIf="user.role === 'admin'"><a class="dropdown-item" routerLink="/admin/dashboard"><i class="fas fa-tachometer-alt"></i> Панель управления</a></li>
                  <li *ngIf="user.role === 'admin'"><a class="dropdown-item" routerLink="/admin/users"><i class="fas fa-users"></i> Пользователи</a></li>
                  <li *ngIf="user.role === 'admin'"><a class="dropdown-item" routerLink="/admin/hotels"><i class="fas fa-hotel"></i> Отели</a></li>
                  <li *ngIf="user.role === 'admin'"><a class="dropdown-item" routerLink="/admin/bookings"><i class="fas fa-calendar-check"></i> Бронирования</a></li>
                  <li *ngIf="user.role === 'admin'"><a class="dropdown-item" routerLink="/admin/reviews"><i class="fas fa-star"></i> Отзывы</a></li>
                  <li *ngIf="user.role === 'admin'"><a class="dropdown-item" routerLink="/admin/services"><i class="fas fa-concierge-bell"></i> Услуги</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="logout(); $event.preventDefault()"><i class="fas fa-sign-out-alt"></i> Выход</a></li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
    <!-- Espace pour compenser la navbar fixed -->
    <div class="header-spacer"></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .navbar {
      height: 80px;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      padding: 0;
      transition: all 0.3s ease;
    }

    .navbar.scrolled {
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      background: rgba(255,255,255,0.98);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      transition: transform 0.2s;
    }

    .navbar-brand:hover {
      transform: scale(1.05);
    }

    .navbar-brand i {
      font-size: 2rem;
      color: #446965;
      transition: transform 0.3s;
    }

    .navbar-brand:hover i {
      transform: rotate(-5deg);
    }

    .navbar-brand span {
      background: linear-gradient(135deg, #446965, #005a60);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar-nav .nav-link {
      padding: 0.5rem 1rem;
      color: #4a5568;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      position: relative;
    }

    .navbar-nav .nav-link i {
      color: #446965;
      transition: transform 0.2s;
    }

    .navbar-nav .nav-link:hover {
      color: #446965;
    }

    .navbar-nav .nav-link:hover i {
      transform: translateY(-2px);
    }

    .navbar-nav .nav-link.active {
      font-weight: 600;
    }

    .navbar-nav .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 1rem;
      right: 1rem;
      height: 2px;
      background: #446965;
      border-radius: 2px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }

    /* Dropdown avec animation */
    .dropdown-menu {
      border: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border-radius: 8px;
      padding: 0.5rem 0;
      display: block;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.5rem;
      color: #4a5568;
      transition: all 0.2s;
    }

    .dropdown-item i {
      width: 18px;
      color: #446965;
      transition: transform 0.2s;
    }

    .dropdown-item:hover {
      background: #f0f5f4;
      color: #446965;
      padding-left: 2rem;
    }

    .dropdown-item:hover i {
      transform: scale(1.2);
    }

    .dropdown-header {
      color: #a0aec0;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0.5rem 1.5rem;
    }

    .dropdown-divider {
      margin: 0.5rem 0;
      border-color: #e2e8f0;
    }

    /* Toggler animé */
    .navbar-toggler {
      border: none;
      padding: 0.5rem;
      transition: transform 0.2s;
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }

    .navbar-toggler.active {
      transform: rotate(90deg);
    }

    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23446965' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
      transition: transform 0.2s;
    }

    .navbar-toggler.active .navbar-toggler-icon {
      transform: rotate(180deg);
    }

    /* Animation du menu mobile */
    .navbar-collapse {
      transition: all 0.3s ease;
    }

    .header-spacer {
      height: 80px;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .navbar {
        height: 70px;
      }
      .header-spacer {
        height: 70px;
      }
      .navbar-collapse {
        background: white;
        padding: 1rem;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.3s ease, opacity 0.2s ease;
      }
      .navbar-collapse.show {
        max-height: 500px;
        opacity: 1;
      }
      .navbar-nav .nav-link {
        padding: 0.75rem 0;
        transform: translateX(-10px);
        transition: transform 0.2s ease;
      }
      .navbar-nav .nav-link:hover {
        transform: translateX(5px);
      }
    }

    @media (max-width: 576px) {
      .navbar {
        height: 60px;
      }
      .header-spacer {
        height: 60px;
      }
      .navbar-brand span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;
  isMenuOpen = false;

  constructor(public authService: AuthService) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 10;
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}