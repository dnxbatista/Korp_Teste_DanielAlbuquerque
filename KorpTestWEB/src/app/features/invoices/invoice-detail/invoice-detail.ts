import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoiceItemService } from '../../../core/services/invoice-item.service';
import { ProductService } from '../../../core/services/product.service';
import { Invoice } from '../../../core/models/invoice.model';
import { Product } from '../../../core/models/product.model';
import { InvoiceItem } from '../../../core/models/invoice-item.model';
import { CreateInvoiceItemRequestDto } from '../../../core/models/dto/create-invoice-item-request.dto';
import { UpdateInvoiceItemRequestDto } from '../../../core/models/dto/update-invoice-item-request.dto';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './invoice-detail.html',
  styleUrls: ['./invoice-detail.scss'],
})
export class InvoiceDetail implements OnInit {
  private invoiceService = inject(InvoiceService);
  private invoiceItemService = inject(InvoiceItemService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  invoice = signal<Invoice | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);
  saving = signal(false);
  printing = signal(false);
  errorMessage = signal<string | null>(null);

  // Form for adding items
  addItemForm = this.fb.group({
    productId: [null as number | null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  // Computed: list of items with product details
  invoiceItems = computed(() => {
    const inv = this.invoice();
    if (!inv) return [];
    return inv.invoiceItems || [];
  });

  // Table columns
  displayedColumns = ['productCode', 'description', 'quantity', 'actions'];

  ngOnInit(): void {
    this.loadProducts();
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = +params['id'];
        if (id) this.loadInvoice(id);
      });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  loadInvoice(id: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.invoiceService
      .getById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => this.invoice.set(data),
        error: (err) => {
          console.error('Failed to load invoice', err);
          this.errorMessage.set('Invoice not found or server error.');
        },
      });
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Open' : 'Closed';
  }

  isOpen(): boolean {
    return this.invoice()?.status === 0;
  }

  // Add invoice item
  addItem(): void {
    if (this.addItemForm.invalid) {
      this.snackBar.open('Please select a product and quantity.', 'Close', { duration: 3000 });
      return;
    }
    const invoice = this.invoice();
    if (!invoice) return;
    if (!this.isOpen()) {
      this.snackBar.open('Cannot add items to a closed invoice.', 'Close', { duration: 3000 });
      return;
    }

    const { productId, quantity } = this.addItemForm.value;
    const product = this.products().find(p => p.id === productId);
    if (!product) return;

    // Check if product already exists in invoice
    const existingItem = this.invoiceItems().find(item => item.productId === productId);
    if (existingItem) {
      // Update quantity (sum)
      const newQuantity = existingItem.quantity + quantity!;
      if (newQuantity > product.stockQuantity) {
        this.snackBar.open(`Not enough stock. Available: ${product.stockQuantity}`, 'Close', { duration: 3000 });
        return;
      }
      this.updateItemQuantity(existingItem.id, newQuantity);
    } else {
      // Create new item
      if (quantity! > product.stockQuantity) {
        this.snackBar.open(`Not enough stock. Available: ${product.stockQuantity}`, 'Close', { duration: 3000 });
        return;
      }
      this.createItem(invoice.id, productId!, quantity!);
    }
  }

  createItem(invoiceId: number, productId: number, quantity: number): void {
    this.saving.set(true);
    const payload: CreateInvoiceItemRequestDto = { invoiceId, productId, quantity };
    this.invoiceItemService
      .create(payload)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Item added.', 'Close', { duration: 2000 });
          this.addItemForm.reset({ quantity: 1 });
          this.loadInvoice(invoiceId);
        },
        error: (err) => {
          console.error('Add item failed', err);
          this.snackBar.open('Failed to add item. ' + (err.error?.message || ''), 'Close', { duration: 5000 });
        },
      });
  }

  updateItemQuantity(itemId: number, newQuantity: number): void {
    this.saving.set(true);
    const payload: UpdateInvoiceItemRequestDto = { quantity: newQuantity };
    this.invoiceItemService
      .update(itemId, payload)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Item updated.', 'Close', { duration: 2000 });
          this.loadInvoice(this.invoice()!.id);
        },
        error: (err) => {
          console.error('Update item failed', err);
          this.snackBar.open('Failed to update item.', 'Close', { duration: 5000 });
        },
      });
  }

  deleteItem(itemId: number): void {
    if (!confirm('Remove this item?')) return;
    this.saving.set(true);
    this.invoiceItemService
      .delete(itemId)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Item removed.', 'Close', { duration: 2000 });
          this.loadInvoice(this.invoice()!.id);
        },
        error: (err) => {
          console.error('Delete item failed', err);
          this.snackBar.open('Failed to remove item.', 'Close', { duration: 5000 });
        },
      });
  }

  // Print / Finalize invoice
  printInvoice(): void {
    const invoice = this.invoice();
    if (!invoice) return;
    if (!this.isOpen()) {
      this.snackBar.open('Invoice is already closed.', 'Close', { duration: 3000 });
      return;
    }
    if (this.invoiceItems().length === 0) {
      this.snackBar.open('Cannot finalize an empty invoice.', 'Close', { duration: 3000 });
      return;
    }
    if (!confirm(`Finalize invoice #${invoice.number}? This will reduce product stock.`)) return;

    this.printing.set(true);
    this.invoiceService
      .print(invoice.id)
      .pipe(
        finalize(() => this.printing.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (updated) => {
          this.invoice.set(updated);
          this.snackBar.open('Invoice finalized successfully.', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Print failed', err);
          this.snackBar.open('Failed to finalize invoice.', 'Close', { duration: 5000 });
        },
      });
  }

  // Update status manually (only if you want to allow closing without print)
  // We'll skip, as print is the intended way.

  goBack(): void {
    this.router.navigate(['/invoices']);
  }
}