using KorpTestAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace KorpTestAPI.DTOs.Invoice
{
    public class CreateInvoiceRequestDto
    {
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Number must be a non-negative integer")]
        public int Number { get; set; }
        [Required]
        [Range(0, 1, ErrorMessage = "Status must be 0 (Open) or 1 (Closed)")]
        public InvoiceStatus Status { get; set; }
    }
}
