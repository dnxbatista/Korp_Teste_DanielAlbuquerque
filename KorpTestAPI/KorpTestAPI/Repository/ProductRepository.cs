using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KorpTestAPI.Data;
using KorpTestAPI.DTOs.Product;
using KorpTestAPI.Interfaces;
using KorpTestAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace KorpTestAPI.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDBContext _context;
        public ProductRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Product> CreateAsync(Product productModel)
        {
            await _context.Products.AddAsync(productModel);
            await _context.SaveChangesAsync();
            return productModel;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product?> UpdateAsync(int id, UpdateProductRequestDto productDto)
        {
            var productToBeUpdated = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (productToBeUpdated == null) return null;

            productToBeUpdated.Description = productDto.Description;
            productToBeUpdated.StockQuantity = productDto.StockQuantity;
            productToBeUpdated.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return productToBeUpdated;
        }
    }
}