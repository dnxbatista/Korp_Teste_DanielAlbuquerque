import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

// Material modules
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './invoices-list.html',
  styleUrls: ['./invoices-list.scss'],
})
export class InvoicesList implements OnInit {
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.invoiceService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.invoices.set(data),
        error: (err) => {
          console.error('Failed to load invoices', err);
          this.errorMessage.set('Could not load invoices. Please try again.');
        },
      });
  }

  newInvoice(): void {
    this.router.navigate(['/invoices/new']);
  }

  viewInvoice(id: number): void {
    this.router.navigate(['/invoices', id]);
  }

  editInvoice(id: number): void {
    // For now we only allow editing status; we can navigate to an edit form.
    // We'll open the detail and allow status change there.
    this.router.navigate(['/invoices', id]);
  }

  deleteInvoice(invoice: Invoice): void {
    if (!confirm(`Delete invoice #${invoice.number}?`)) return;
    this.invoiceService.delete(invoice.id).subscribe({
      next: () => this.loadInvoices(),
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete invoice.');
      },
    });
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Open' : 'Closed';
  }

  isOpen(status: number): boolean {
    return status === 0;
  }
}