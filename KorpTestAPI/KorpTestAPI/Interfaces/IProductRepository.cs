using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KorpTestAPI.DTOs.Product;
using KorpTestAPI.Models;

namespace KorpTestAPI.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();
        Task<Product> CreateAsync(Product productDto);
        Task<Product?> GetByIdAsync(int id);
        Task<Product?> UpdateAsync(int id, UpdateProductRequestDto productDto);
    }
}