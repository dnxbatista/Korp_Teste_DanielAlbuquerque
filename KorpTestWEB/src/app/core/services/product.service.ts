import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";
import { CreateProductRequestDto } from "../models/dto/create-product-request.dto";
import { UpdateProductRequestDto } from "../models/dto/update-product-request.dto";

// From my understand, services is like a repository (From c#) 
// here we all functions that gonna return something from the api

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly baseUrl = `${environment.baseApiUrl}/product`;

    constructor(private http: HttpClient) {}

    // here is the getAll function, that return a array of products 
    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.baseUrl);
    }

    // this use a parameters , the id => number (int)
    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    create(payload: CreateProductRequestDto): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, payload);
    }

    update(id: number, payload: UpdateProductRequestDto): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
