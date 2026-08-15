using KorpTestAPI.Data;
using KorpTestAPI.Interfaces;
using KorpTestAPI.Models;

namespace KorpTestAPI.Repository
{
    public class InvoiceItemRepository : IInvoiceItemRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IProductRepository _productRepo;
        public InvoiceItemRepository(ApplicationDBContext context, IProductRepository productRepo)
        {
            _context = context;
            _productRepo = productRepo;
        }
        public async Task<InvoiceItem> CreateInvoiceItem(InvoiceItem invoiceItem)
        {
            await _context.AddAsync(invoiceItem);
            await _context.SaveChangesAsync();
            return invoiceItem;
        }

        public async Task<InvoiceItem?> DeleteInvoiceItem(int id)
        {
            var invoiceItem = _context.InvoiceItems.FirstOrDefault(i => i.Id == id);

            if (invoiceItem == null) return null;

            _context.InvoiceItems.Remove(invoiceItem);
            await _context.SaveChangesAsync();
            return invoiceItem;
        }

        public async Task<List<InvoiceItem>> GetInvoiceItemsWithProduct(string productCode)
        {
            var invoices = _context.InvoiceItems.Where(i => i.Product.Code.ToLower() == productCode.ToLower()).ToList();
            return invoices;
        }

        public async Task<InvoiceItem?> UpdateInvoiceItem(int id, InvoiceItem invoiceItem)
        {
            var existingInvoiceItem = _context.InvoiceItems.FirstOrDefault(i => i.Id == id);

            if (existingInvoiceItem == null) return null;
            
            existingInvoiceItem.Quantity = invoiceItem.Quantity;
            await _context.SaveChangesAsync();
            return existingInvoiceItem;
        }
    }
}
