import { Service, Inject, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';

@Service()
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5144/api/product';

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }
}
