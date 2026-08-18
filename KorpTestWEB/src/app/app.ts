import { Component, signal } from '@angular/core';
import { ProductListComponent } from './features/products/product-list/product-list.component';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('KorpTestWEB');
}
