using KorpTestAPI.Models;

namespace KorpTestAPI.Interfaces
{
    public interface IInvoiceItemRepository
    {
        Task<InvoiceItem> CreateInvoiceItem(InvoiceItem invoiceItem);
        Task<InvoiceItem?> UpdateInvoiceItem(int id,InvoiceItem invoiceItem);
        Task<InvoiceItem?> DeleteInvoiceItem(int id);
        Task<List<InvoiceItem>> GetInvoiceItemsWithProduct(string productCode);
    }
}
