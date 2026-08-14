using KorpTestAPI.DTOs.Invoice;
using KorpTestAPI.Models;

namespace KorpTestAPI.Mappers
{
    public static class InvoiceMapper
    {
        public static Invoice FromCreateToInvoice(this CreateInvoiceRequestDto invoiceDto)
        {
            return new Invoice
            {
                Number = invoiceDto.Number,
                Status = invoiceDto.Status
            };
        }

        public static Invoice FromUpdateToInvoice(this UpdateInvoiceRequestDto invoiceDto)
        {
            return new Invoice
            {
                Status = invoiceDto.Status
            };
        }
    }
}
