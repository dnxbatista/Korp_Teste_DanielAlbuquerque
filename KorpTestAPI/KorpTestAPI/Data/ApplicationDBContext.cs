using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KorpTestAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace KorpTestAPI.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Make the "Code" field unique.
            modelBuilder.Entity<Product>().HasIndex(p => p.Code).IsUnique();

            modelBuilder.Entity<Invoice>(e =>
            {
                e.HasIndex(inv => inv.Number).IsUnique();

                e.HasMany(inv => inv.InvoiceItems).WithOne(item => item.Invoice).HasForeignKey(item => item.InvoiceId);
            });

            modelBuilder.Entity<InvoiceItem>(e =>
            {
                e.HasKey(i => new
                {
                    i.InvoiceId,
                    i.ProductId
                });

                e.HasOne(i => i.Invoice).WithMany(inv => inv.InvoiceItems).HasForeignKey(i => i.InvoiceId);
                e.HasOne(i => i.Product).WithMany(p => p.InvoiceItems).HasForeignKey(i => i.ProductId);
            });
        }
    }
}