using KorpTestAPI.DTOs.InvoiceItem;
using KorpTestAPI.Interfaces;
using KorpTestAPI.Mappers;
using KorpTestAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace KorpTestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceItemController : ControllerBase
    {
        private readonly IInvoiceItemRepository _invoiceItemRepo;
        private readonly IProductRepository _productRepo;
        private readonly IInvoiceRepository _invoiceRepo;
        public InvoiceItemController(IInvoiceItemRepository invoiceItemRepo, IProductRepository productRepo, IInvoiceRepository invoiceRepo)
        {
            _invoiceItemRepo = invoiceItemRepo;
            _productRepo = productRepo;
            _invoiceRepo = invoiceRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetInvoiceItemsWithProduct(string productCode)
        {
            var invoiceItems = await _invoiceItemRepo.GetInvoiceItemsWithProduct(productCode);

            return Ok(invoiceItems.Select(i => i.FromInvoiceItemToInvoiceDto()));
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoiceItem([FromBody] CreateInvoiceItemRequestDto invoiceDto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);
            // CHECKS (!NOT GOOD WAY TO DO IT, BUT FOR THE PURPOSE OF THIS API, IT'S OKAY)
            var productModel = await _productRepo.GetByIdAsync(invoiceDto.ProductId);
            var invoiceModel = await _invoiceRepo.GetByIdAsync(invoiceDto.InvoiceId);
            if (productModel == null)
            {
                return NotFound($"Invoice with ID {invoiceDto.InvoiceId} not found.");
            }

            if (invoiceModel == null)
            {
                return NotFound($"Product with code {invoiceDto.ProductId} not found.");
            }

            if (invoiceDto.Quantity > productModel.StockQuantity)
            {
                return BadRequest("Quantity value higher than product stock quantity.");
            }

            var createdInvoiceItem = await _invoiceItemRepo.CreateInvoiceItem(invoiceDto.FromCreateToInvoiceItem());
            return CreatedAtAction(nameof(CreateInvoiceItem), new { id = createdInvoiceItem.Id }, createdInvoiceItem);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateInvoiceItem(int id, [FromBody] UpdateInvoiceItemRequestDto invoiceDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedInvoiceItem = await _invoiceItemRepo.UpdateInvoiceItem(id, invoiceDto.FromUpdateToInvoiceItem());

            if (updatedInvoiceItem == null) return NotFound();

            return Ok(updatedInvoiceItem.FromInvoiceItemToInvoiceDto());
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteInvoiceItem(int id)
        {
            var deletedInvoiceItem = await _invoiceItemRepo.DeleteInvoiceItem(id);

            if (deletedInvoiceItem == null) return NotFound();

            return Ok(deletedInvoiceItem.FromInvoiceItemToInvoiceDto());
        }
    }
}
