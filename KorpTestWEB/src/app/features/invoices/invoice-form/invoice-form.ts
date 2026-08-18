import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { CreateInvoiceRequestDto } from '../../../core/models/dto/create-invoice-request.dto';
import { finalize } from 'rxjs';

// Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './invoice-form.html',
  styleUrls: ['./invoice-form.scss'],
})
export class InvoiceForm {
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  createInvoice(): void {
    this.loading.set(true);
    // Send dummy values; backend will override number and status.
    const payload: CreateInvoiceRequestDto = { number: 0, status: 0 };
    this.invoiceService
      .create(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (invoice) => {
          this.snackBar.open(`Invoice #${invoice.number} created!`, 'Close', { duration: 3000 });
          this.router.navigate(['/invoices', invoice.id]);
        },
        error: (err) => {
          console.error('Create failed', err);
          this.snackBar.open('Failed to create invoice.', 'Close', { duration: 5000 });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/invoices']);
  }
}