import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceItem } from '../../../core/models/invoice-item.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-invoice-items-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './invoice-items-table.html',
  styleUrls: ['./invoice-items-table.scss'],
})
export class InvoiceItemsTable {
  @Input() items: InvoiceItem[] = [];
  @Input() editable = true;
  @Output() increase = new EventEmitter<InvoiceItem>();
  @Output() decrease = new EventEmitter<InvoiceItem>();
  @Output() remove = new EventEmitter<InvoiceItem>();

  displayedColumns = ['productCode', 'description', 'quantity', 'actions'];
}