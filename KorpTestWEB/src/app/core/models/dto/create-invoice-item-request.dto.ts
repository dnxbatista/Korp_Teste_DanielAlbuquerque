export interface CreateInvoiceItemRequestDto {
  invoiceId: number;
  productId: number;
  quantity: number;
}