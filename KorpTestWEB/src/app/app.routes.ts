import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductsFormComponent } from './features/products/products-form/products-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductsFormComponent },
  { path: 'products/:id/edit', component: ProductsFormComponent },

  { path: '**', redirectTo: 'products' },
];
