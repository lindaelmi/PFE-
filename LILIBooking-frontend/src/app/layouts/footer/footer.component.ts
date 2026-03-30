import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <h5><i class="fas fa-hotel"></i> LILIBooking</h5>
            <p class="text-white-50">
              Бронируйте отели, транспорт и экскурсии по всему миру.<br>
              Лучшие предложения с гарантией для ваших путешествий.
            </p>
            <div class="social-links">
              <a href="#" class="text-white me-2"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="text-white me-2"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-white me-2"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-white me-2"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
          <div class="col-md-2 mb-4 mb-md-0">
            <h5>Быстрые ссылки</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/" class="text-white-50">Главная</a></li>
              <li><a routerLink="/hotels" class="text-white-50">Отели</a></li>
              <li><a routerLink="/excursions" class="text-white-50">Экскурсии</a></li>
              <li><a routerLink="/transports" class="text-white-50">Транспорт</a></li>
              <li><a routerLink="/contact" class="text-white-50">Контакты</a></li>
            </ul>
          </div>
          <div class="col-md-3 mb-4 mb-md-0">
            <h5>Контакты</h5>
            <ul class="list-unstyled">
              <li class="text-white-50"><i class="fas fa-envelope me-2"></i> contact@lilibooking.com</li>
              <li class="text-white-50"><i class="fas fa-phone-alt me-2"></i> +33 1 23 45 67 89</li>
              <li class="text-white-50"><i class="fas fa-map-marker-alt me-2"></i> 123 Елисейские Поля, 75008 Париж, Франция</li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5>Новостная рассылка</h5>
            <p class="text-white-50">Подпишитесь, чтобы получать лучшие предложения</p>
            <form class="newsletter-form" (submit)="$event.preventDefault()">
              <div class="input-group">
                <input type="email" class="form-control" placeholder="Ваш email" aria-label="Email">
                <button class="btn btn-accent" type="submit">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
              <small class="text-white-50">Подписываясь, вы соглашаетесь с нашей <a href="#" class="text-accent">политикой конфиденциальности</a></small>
            </form>
          </div>
        </div>
        <hr class="mt-4">
        <div class="row">
          <div class="col-md-6 text-center text-md-start">
            <p class="mb-0 text-white-50">&copy; 2025 LILIBooking. Все права защищены.</p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <a href="#" class="text-white-50 me-3">Юридическая информация</a>
            <a href="#" class="text-white-50 me-3">Политика конфиденциальности</a>
            <a href="#" class="text-white-50">Общие условия</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #005a60 0%, #00838f 100%);
      color: white;
      padding: 4rem 0 2rem;
      margin-top: auto;
    }
    .footer h5 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }
    .footer h5 i {
      color: #d9bb80;
      margin-right: 0.5rem;
    }
    .footer a {
      transition: color 0.3s ease;
      text-decoration: none;
    }
    .footer a:hover {
      color: #d9bb80 !important;
    }
    .footer .text-accent {
      color: #d9bb80;
    }
    .footer .social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transition: all 0.3s ease;
      color: white;
    }
    .footer .social-links a:hover {
      background: #d9bb80;
      color: #005a60;
      transform: translateY(-3px);
    }
    .footer hr {
      border-color: rgba(255, 255, 255, 0.1);
    }
    .footer .btn-accent {
      background: linear-gradient(135deg, #d9bb80 0%, #f4d06f 100%);
      color: #343a40;
      border: none;
      padding: 0.375rem 0.75rem;
    }
    .footer .btn-accent:hover {
      background: linear-gradient(135deg, #f4d06f 0%, #d9bb80 100%);
      transform: translateY(-2px);
    }
    .footer .input-group .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
    }
    .footer .input-group .form-control::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    .footer .input-group .form-control:focus {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: none;
      outline: none;
    }
    @media (max-width: 768px) {
      .footer {
        text-align: center;
      }
      .footer .social-links {
        justify-content: center;
      }
      .footer .input-group {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class FooterComponent {}