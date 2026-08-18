import { Product } from './product.model';

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  productId: number;
  quantity: number;
  product?: Product;
}