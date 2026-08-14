using System.ComponentModel.DataAnnotations.Schema;

namespace KorpTestAPI.Models
{
    [Table("InvoiceItem")]
    public class InvoiceItem
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
    }
}
