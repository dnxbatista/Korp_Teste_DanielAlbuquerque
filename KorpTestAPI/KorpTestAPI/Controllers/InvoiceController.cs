using KorpTestAPI.DTOs.Invoice;
using KorpTestAPI.Interfaces;
using KorpTestAPI.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace KorpTestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepo;
        public InvoiceController(IInvoiceRepository invoiceRepo)
        {
            _invoiceRepo = invoiceRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var invoices = await _invoiceRepo.GetAllAsync();
            return Ok(invoices);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var invoiceModel = await _invoiceRepo.GetByIdAsync(id);

            if (invoiceModel == null) return NotFound("Invoice not found");

            return Ok(invoiceModel);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInvoiceRequestDto invoiceDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _invoiceRepo.ExistByNumber(invoiceDto.Number))
            {
                return Conflict("Invoice with this number already exists");
            }

            var invoiceModel = invoiceDto.FromCreateToInvoice();

            var createdInvoice = await _invoiceRepo.CreateAsync(invoiceModel);

            return CreatedAtAction(nameof(GetById), new { id = createdInvoice.Id }, createdInvoice);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateInvoiceRequestDto invoiceDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedInvoice = await _invoiceRepo.UpdateAsync(id, invoiceDto);

            if (updatedInvoice == null) return NotFound("Invoice not found");

            return Ok(updatedInvoice);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var deletedInvoice = await _invoiceRepo.DeleteAsync(id);

            if (deletedInvoice == null) return NotFound("Invoice not found");

            return Ok("Deleted Invoice with ID: " + id);
        }
    }
}
