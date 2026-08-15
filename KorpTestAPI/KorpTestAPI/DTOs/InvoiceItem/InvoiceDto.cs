using System.ComponentModel.DataAnnotations;

namespace KorpTestAPI.DTOs.InvoiceItem
{
    public class InvoiceDto
    {
        public int Id { get; set; }
        [Required]
        public int InvoiceId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
    }
}
