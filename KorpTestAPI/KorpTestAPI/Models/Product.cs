using System.ComponentModel.DataAnnotations.Schema;

namespace KorpTestAPI.Models
{
    [Table("Products")]
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
        public List<InvoiceItem> InvoiceItems { get; set; } = [];
    }
}
