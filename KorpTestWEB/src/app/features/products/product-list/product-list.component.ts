import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

// Angular Material modules
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
})
export class ProductListComponent implements OnInit {
  // DI with inject() – Angular 17+ style
  private productService = inject(ProductService);
  private router = inject(Router);

  // State signals
  products = signal<Product[]>([]);
  searchQuery = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Computed: filtered list (reacts to products and searchQuery)
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.products();
    return this.products().filter(
      (p) =>
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.productService
      .getAll()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => this.products.set(data),
        error: (err) => {
          console.error('Failed to load products', err);
          this.errorMessage.set('Could not load products. Please try again later.');
        },
      });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  newProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete product "${product.code}"?`)) return;

    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete product. Please try again.');
      },
    });
  }
}