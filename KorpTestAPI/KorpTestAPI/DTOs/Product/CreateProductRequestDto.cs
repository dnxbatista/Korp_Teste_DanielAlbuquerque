using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace KorpTestAPI.DTOs.Product
{
    public class CreateProductRequestDto
    {
        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;
        [Required]
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Itens on stock can't be negative")]
        public int StockQuantity { get; set; }
    }
}