import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { CreateInvoiceRequestDto } from '../models/dto/create-invoice-request.dto';
import { UpdateInvoiceRequestDto } from '../models/dto/update-invoice-request.dto';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly baseUrl = `${environment.baseApiUrl}/invoice`;
  private http = inject(HttpClient);

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl);
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateInvoiceRequestDto): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, payload);
  }

  update(id: number, payload: UpdateInvoiceRequestDto): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Print/finalize invoice
  print(id: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/${id}/print`, {});
  }
}