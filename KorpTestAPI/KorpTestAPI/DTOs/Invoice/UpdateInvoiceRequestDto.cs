using KorpTestAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace KorpTestAPI.DTOs.Invoice
{
    public class UpdateInvoiceRequestDto
    {
        [Required]
        [Range(0, 1, ErrorMessage = "Status must be 0 (Open) or 1 (Closed)")]
        public InvoiceStatus Status { get; set; }
    }
}
