import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],  // JsonPipe is included in CommonModule
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;   // observable, not array
  loading = true;                     // initial state

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.products$ = this.productService.getAll().pipe(
      finalize(() => {
        this.loading = false;
      })
    );
  }

  newProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete product ${product.code}?`)) return;

    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error('Delete failed', err)
    });
  }
}