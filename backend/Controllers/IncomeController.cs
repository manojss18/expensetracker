using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

[ApiController]
[Route("api/income")]
public class IncomesController : ControllerBase
{
    private readonly AppDbContext _context;

    public IncomesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/income
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Income>>> GetIncome()
    {
        var income = await _context.Incomes
            .OrderByDescending(i => i.IncomeDate)
            .ToListAsync();

        return Ok(income);
    }

    // GET: api/income/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Income>> GetIncomeById(int id)
    {
        var income = await _context.Incomes
            .FindAsync(id);

        if (income == null)
        {
            return NotFound();
        }

        return Ok(income);
    }

    // POST: api/income
    [HttpPost]
    public async Task<ActionResult<Income>> CreateIncome(
        Income income)
    {
        income.Id = 0;

        _context.Incomes.Add(income);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetIncomeById),
            new { id = income.Id },
            income
        );
    }

    // PUT: api/income/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateIncome(
        int id,
        Income income)
    {
        if (id != income.Id)
        {
            return BadRequest();
        }

        var existingIncome =
            await _context.Incomes.FindAsync(id);

        if (existingIncome == null)
        {
            return NotFound();
        }

        existingIncome.Source =
            income.Source;

        existingIncome.Amount =
            income.Amount;

        existingIncome.Description =
            income.Description;

        existingIncome.IncomeDate =
            income.IncomeDate;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/income/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        var income =
            await _context.Incomes.FindAsync(id);

        if (income == null)
        {
            return NotFound();
        }

        _context.Incomes.Remove(income);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}