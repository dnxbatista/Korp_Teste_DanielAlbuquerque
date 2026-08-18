import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductsFormComponent } from './features/products/products-form/products-form.component';
import { InvoicesList } from './features/invoices/invoices-list/invoices-list';
import { InvoiceForm } from './features/invoices/invoice-form/invoice-form';
import { InvoiceDetail } from './features/invoices/invoice-detail/invoice-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // Products
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductsFormComponent },
  { path: 'products/:id/edit', component: ProductsFormComponent },

  // Invoices
  { path: 'invoices', component: InvoicesList },
  { path: 'invoices/new', component: InvoiceForm },
  { path: 'invoices/:id', component: InvoiceDetail },

  { path: '**', redirectTo: 'products' },
];