import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CreateProductRequestDto } from '../../../core/models/dto/create-product-request.dto';
import { UpdateProductRequestDto } from '../../../core/models/dto/update-product-request.dto';
import { finalize, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './products-form.html',
  styleUrls: ['./products-form.scss'],
})
export class ProductsFormComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  // Form
  productForm = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(200)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
  });

  // UI state
  loading = signal(false);
  isEditMode = signal(false);
  productId = signal<number | null>(null);

  ngOnInit(): void {
    // Check if we are in edit mode
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params['id'];
        if (id) {
          this.isEditMode.set(true);
          this.productId.set(+id);
          this.loadProduct(+id);
        } else {
          this.isEditMode.set(false);
          this.productId.set(null);
          // Optionally set default values
          this.productForm.patchValue({ stockQuantity: 0 });
        }
      });
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService
      .getById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (product) => {
          this.productForm.patchValue({
            code: product.code,
            description: product.description,
            stockQuantity: product.stockQuantity,
          });
          // Disable code field in edit mode (optional)
          this.productForm.get('code')?.disable();
        },
        error: (err) => {
          console.error('Failed to load product', err);
          this.snackBar.open('Product not found or server error.', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        },
      });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.snackBar.open('Please fix the errors before submitting.', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const formValue = this.productForm.getRawValue(); // includes disabled fields

    let request$;
    if (this.isEditMode() && this.productId()) {
      const payload: UpdateProductRequestDto = {
        description: formValue.description!,
        stockQuantity: formValue.stockQuantity!,
      };
      request$ = this.productService.update(this.productId()!, payload);
    } else {
      const payload: CreateProductRequestDto = {
        code: formValue.code!,
        description: formValue.description!,
        stockQuantity: formValue.stockQuantity!,
      };
      request$ = this.productService.create(payload);
    }

    request$
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.isEditMode() ? 'Product updated successfully!' : 'Product created successfully!',
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Save failed', err);
          this.snackBar.open('Failed to save product. Please try again.', 'Close', { duration: 5000 });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}