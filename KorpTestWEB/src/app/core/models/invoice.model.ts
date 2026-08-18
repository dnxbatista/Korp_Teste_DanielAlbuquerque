import { InvoiceItem } from './invoice-item.model';

export interface Invoice {
  id: number;
  number: number;
  status: number; // 0 = Open, 1 = Closed
  createdAt: string;
  invoiceItems?: InvoiceItem[];
}