// app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer/footer';
import { NavbarComponent } from './components/navbar/navbar/navbar';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner/loading-spinner';
import { ToastComponent } from './components/toast/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    ToastComponent,
  ],
  templateUrl: './app.html',
})
export class AppComponent {
  title = 'E-Commerce Store';
}
