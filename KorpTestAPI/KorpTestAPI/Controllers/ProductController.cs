using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using KorpTestAPI.Interfaces;
using KorpTestAPI.DTOs.Product;
using KorpTestAPI.Mappers;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace KorpTestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;

        public ProductController(IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productRepo.GetAllAsync();
            return Ok(products);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var product = await _productRepo.GetByIdAsync(id);

            if (product == null) return NotFound("Product not found");

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductRequestDto productDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _productRepo.ExistByCode(productDto.Code)) return Conflict("Another product have the same code");

            var productModel = productDto.ToProductFromCreateDto();

            await _productRepo.CreateAsync(productModel);

            return CreatedAtAction(nameof(GetById), new {id = productModel.Id}, productModel);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute]int id, [FromBody] UpdateProductRequestDto productDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var productModel = await _productRepo.UpdateAsync(id, productDto);

            if (productModel == null) return NotFound("Product not found");

            return Ok(productModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            var productModel = await _productRepo.DeleteAsync(id);

            if (productModel == null) return NotFound("Product not found");

            return Ok("Deleted Product with ID: " + id);
        }
    }
}