using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KorpTestAPI.DTOs.Product;
using KorpTestAPI.Models;

namespace KorpTestAPI.Mappers
{
    public static class ProductMapper
    {
        public static Product ToProductFromCreateDto(this CreateProductRequestDto productDto)
        {
            return new Product
            {
                Code = productDto.Code,
                Description = productDto.Description,
                StockQuantity = productDto.StockQuantity
            };
        }
    }
}