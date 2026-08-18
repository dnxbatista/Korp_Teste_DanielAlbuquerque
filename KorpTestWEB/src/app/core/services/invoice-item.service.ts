import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { InvoiceItem } from '../models/invoice-item.model';
import { InvoiceDto } from '../models/dto/invoice.dto';
import { CreateInvoiceItemRequestDto } from '../models/dto/create-invoice-item-request.dto';
import { UpdateInvoiceItemRequestDto } from '../models/dto/update-invoice-item-request.dto';

@Injectable({ providedIn: 'root' })
export class InvoiceItemService {
  private readonly baseUrl = `${environment.baseApiUrl}/invoiceitem`;
  private http = inject(HttpClient);

  // Get invoice items by product code (case‑insensitive)
  getByProductCode(productCode: string): Observable<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>(this.baseUrl, { params: { productCode } });
  }

  create(payload: CreateInvoiceItemRequestDto): Observable<InvoiceItem> {
    return this.http.post<InvoiceItem>(this.baseUrl, payload);
  }

  update(id: number, payload: UpdateInvoiceItemRequestDto): Observable<InvoiceDto> {
    return this.http.put<InvoiceDto>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<InvoiceDto> {
    return this.http.delete<InvoiceDto>(`${this.baseUrl}/${id}`);
  }
}