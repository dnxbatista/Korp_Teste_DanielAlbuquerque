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
        }
    }
}