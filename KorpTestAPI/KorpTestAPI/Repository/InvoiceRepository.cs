using KorpTestAPI.Data;
using KorpTestAPI.DTOs.Invoice;
using KorpTestAPI.Enums;
using KorpTestAPI.Interfaces;
using KorpTestAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace KorpTestAPI.Repository
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDBContext _context;
        public InvoiceRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Invoice> CreateAsync(Invoice invoiceModel)
        {
            await _context.Invoices.AddAsync(invoiceModel);
            await _context.SaveChangesAsync();
            return invoiceModel;
        }

        public async Task<Invoice?> DeleteAsync(int id)
        {
            var invoiceModel = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            if (invoiceModel == null) return null;
            _context.Invoices.Remove(invoiceModel);
            await _context.SaveChangesAsync();
            return invoiceModel;
        }

        public async Task<bool> ExistByNumber(int id)
        {
            return await _context.Invoices.AnyAsync(i => i.Number == id);
        }

        public async Task<List<Invoice>> GetAllAsync()
        {
            return await _context.Invoices.Include(i => i.InvoiceItems).ToListAsync();
        }

        public async Task<Invoice?> GetByIdAsync(int id)
        {
            var invoiceModel = await _context.Invoices.Include(i => i.InvoiceItems).ThenInclude(i => i.Product).FirstOrDefaultAsync(i => i.Id == id);
            return invoiceModel;
        }

        public async Task<Invoice?> UpdateAsync(int id, UpdateInvoiceRequestDto invoiceDto)
        {
            var invoiceModel = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);

            if (invoiceModel == null) return null;

            invoiceModel.Status = invoiceDto.Status;

            await _context.SaveChangesAsync();
            return invoiceModel;
        }

        public async Task<Invoice?> FinalizeAsync(int id)
        {
            var invoiceModel = await _context.Invoices.Include(i => i.InvoiceItems).ThenInclude(i => i.Product).FirstOrDefaultAsync(i => i.Id == id);

            if (invoiceModel == null || invoiceModel.Status != InvoiceStatus.Open)
            {
                return null;
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            foreach (var item in invoiceModel.InvoiceItems)
            {
                if (item.Product == null || item.Product.StockQuantity < item.Quantity)
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                item.Product.StockQuantity -= item.Quantity;
                item.Product.UpdatedAt = DateTime.Now;
            }

            invoiceModel.Status = InvoiceStatus.Closed;
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return invoiceModel;
        }
    }
}
