export interface CreateInvoiceRequestDto {
  number: number;   // will be auto-generated, but sent anyway
  status: number;   // will be forced to 0 (Open)
}