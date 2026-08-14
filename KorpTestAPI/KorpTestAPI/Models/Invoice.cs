using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KorpTestAPI.Enums;

namespace KorpTestAPI.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public InvoiceStatus Status { get; set; }
        public List<InvoiceItem> InvoiceItems { get; set; } = [];
        public DateTime CreatedAt { get; set; }
    }
}