using KorpTestAPI.DTOs.InvoiceItem;
using KorpTestAPI.Models;

namespace KorpTestAPI.Mappers
{
    public static class InvoiceItemMapper
    {
        public static InvoiceDto FromInvoiceItemToInvoiceDto(this InvoiceItem invoiceItem) 
        {
            return new InvoiceDto
            {
                Id = invoiceItem.Id,
                InvoiceId = invoiceItem.InvoiceId,
                ProductId = invoiceItem.ProductId,
                Quantity = invoiceItem.Quantity
            };
        }

        public static InvoiceItem FromCreateToInvoiceItem(this CreateInvoiceItemRequestDto invoiceItemDto) 
        {
            return new InvoiceItem
            {
                InvoiceId = invoiceItemDto.InvoiceId,
                ProductId = invoiceItemDto.ProductId,
                Quantity = invoiceItemDto.Quantity
            };
        }

        public static InvoiceItem FromUpdateToInvoiceItem(this UpdateInvoiceItemRequestDto invoiceItemDto)
        {
            return new InvoiceItem
            {
                Quantity = invoiceItemDto.Quantity
            };
        }
    }
}
