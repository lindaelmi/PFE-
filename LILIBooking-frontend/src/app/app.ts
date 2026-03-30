import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';   // ← À AJOUTER
import { FooterComponent } from './layouts/footer/footer.component';   // ← À AJOUTER
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,   // ←
    FooterComponent    // ←
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'LILIBooking';
}