import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-wrapper">
      <!-- Barre latérale -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <div class="logo-container">
            <i class="fas fa-crown fa-2x"></i>
            <h2>LILI Админ</h2>
          </div>
          <p class="subtitle">Панель управления</p>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
            <i class="fas fa-tachometer-alt"></i>
            <span>Дашборд</span>
          </a>
          <a routerLink="/admin/hotels" routerLinkActive="active" class="nav-link">
            <i class="fas fa-hotel"></i>
            <span>Отели</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">
            <i class="fas fa-users"></i>
            <span>Пользователи</span>
          </a>
          <a routerLink="/admin/bookings" routerLinkActive="active" class="nav-link">
            <i class="fas fa-calendar-check"></i>
            <span>Бронирования</span>
          </a>
          <a routerLink="/admin/reviews" routerLinkActive="active" class="nav-link">
            <i class="fas fa-star"></i>
            <span>Отзывы</span>
          </a>
          <a routerLink="/admin/services" routerLinkActive="active" class="nav-link">
            <i class="fas fa-concierge-bell"></i>
            <span>Услуги</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <i class="fas fa-user-circle"></i>
            <span>Админ</span>
          </div>
          <a href="/" class="logout-link">
            <i class="fas fa-sign-out-alt"></i>
          </a>
        </div>
      </aside>

      <!-- Contenu principal -->
      <main class="admin-main">
        <div class="content-header">
          <h1 class="page-title">Панель управления</h1>
          <div class="header-actions">
            <button class="btn-notification">
              <i class="fas fa-bell"></i>
              <span class="badge">3</span>
            </button>
            <div class="user-profile">
              <img src="https://via.placeholder.com/40" alt="Профиль" class="profile-img">
            </div>
          </div>
        </div>

        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f4f7fc;
    }

    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* ===== SIDEBAR ===== */
    .admin-sidebar {
      width: 280px;
      background: linear-gradient(180deg, #446965 0%, #005a60 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 10;
      transition: all 0.3s ease;
    }

    .sidebar-header {
      padding: 2rem 1.5rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .logo-container i {
      color: #d9bb80;
      filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3));
    }

    .logo-container h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .subtitle {
      font-size: 0.85rem;
      opacity: 0.7;
      margin: 0;
      font-weight: 300;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.9rem 1.8rem;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link i {
      width: 24px;
      text-align: center;
      font-size: 1.2rem;
      transition: transform 0.2s;
    }

    .nav-link span {
      font-weight: 500;
      font-size: 1rem;
    }

    .nav-link:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
      transform: translateX(5px);
    }

    .nav-link:hover i {
      transform: scale(1.1);
    }

    .nav-link.active {
      color: #fff;
      background: rgba(255,255,255,0.15);
      box-shadow: inset 4px 0 0 #d9bb80;
    }

    .nav-link.active i {
      color: #d9bb80;
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 0.95rem;
    }

    .user-info i {
      font-size: 1.8rem;
      color: #d9bb80;
    }

    .logout-link {
      color: rgba(255,255,255,0.6);
      font-size: 1.3rem;
      transition: all 0.2s;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .logout-link:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
      transform: rotate(10deg);
    }

    /* ===== CONTENU PRINCIPAL ===== */
    .admin-main {
      flex: 1;
      background: #f4f7fc;
      display: flex;
      flex-direction: column;
    }

    .content-header {
      background: #fff;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
      background: linear-gradient(135deg, #446965 0%, #005a60 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .btn-notification {
      background: none;
      border: none;
      font-size: 1.3rem;
      color: #7f8c8d;
      position: relative;
      cursor: pointer;
      transition: color 0.2s;
      padding: 0.5rem;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-notification:hover {
      color: #446965;
      background: #f0f0f0;
    }

    .badge {
      position: absolute;
      top: 5px;
      right: 5px;
      background: #d9bb80;
      color: #fff;
      font-size: 0.7rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .user-profile {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #446965;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .user-profile:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(68,105,101,0.3);
    }

    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .content-body {
      padding: 2rem;
      flex: 1;
      animation: fadeIn 0.5s ease;
    }

    /* Animation d'apparition */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 992px) {
      .admin-sidebar {
        width: 80px;
        overflow: visible;
      }

      .logo-container h2, .subtitle, .nav-link span, .user-info span, .logout-link span {
        display: none;
      }

      .nav-link {
        justify-content: center;
        padding: 1.2rem 0;
      }

      .nav-link i {
        font-size: 1.5rem;
        width: auto;
      }

      .sidebar-footer {
        justify-content: center;
      }

      .user-info i {
        font-size: 2rem;
      }

      .logout-link {
        width: 100%;
        border-radius: 0;
      }
    }

    @media (max-width: 768px) {
      .admin-wrapper {
        flex-direction: column;
      }

      .admin-sidebar {
        width: 100%;
        flex-direction: row;
        align-items: center;
        padding: 0 1rem;
        min-height: 70px;
      }

      .sidebar-header {
        display: none;
      }

      .sidebar-nav {
        flex-direction: row;
        padding: 0;
        gap: 0;
      }

      .nav-link {
        flex: 1;
        padding: 1rem 0;
      }

      .nav-link span {
        display: none;
      }

      .nav-link i {
        font-size: 1.3rem;
      }

      .sidebar-footer {
        border-top: none;
        border-left: 1px solid rgba(255,255,255,0.15);
        padding: 0 1rem;
      }
    }
  `]
})
export class AdminLayoutComponent {}