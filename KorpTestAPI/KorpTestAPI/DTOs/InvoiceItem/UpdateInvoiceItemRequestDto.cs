using System.ComponentModel.DataAnnotations;

namespace KorpTestAPI.DTOs.InvoiceItem
{
    public class UpdateInvoiceItemRequestDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
    }
}
