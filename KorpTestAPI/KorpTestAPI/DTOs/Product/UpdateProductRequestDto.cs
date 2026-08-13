using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace KorpTestAPI.DTOs.Product
{
    public class UpdateProductRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Itens on stock can't be negative")]
        public int StockQuantity { get; set; }
    }
}