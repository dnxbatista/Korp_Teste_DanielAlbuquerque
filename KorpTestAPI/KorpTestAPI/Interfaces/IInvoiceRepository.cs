using KorpTestAPI.DTOs.Invoice;
using KorpTestAPI.Models;

namespace KorpTestAPI.Interfaces
{
    public interface IInvoiceRepository
    {
        Task<List<Invoice>> GetAllAsync();
        Task<Invoice?> GetByIdAsync(int id);
        Task<Invoice> CreateAsync(Invoice invoiceModel);

        // The CreateInvoiceRequestDto is used to create a new invoice,
        // and the UpdateAsync method will update an existing invoice with the provided data.
        Task<Invoice?> UpdateAsync(int id, UpdateInvoiceRequestDto invoiceDto);
        Task<Invoice?> DeleteAsync(int id);
        Task<bool> ExistByNumber(int id); // This method checks if an invoice with the given number exists in the database.
    }
}
