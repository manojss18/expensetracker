using ExpenseTracker.Api.Data;
using ExpenseTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Controllers;

[ApiController]
[Route("api/expenses")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/expenses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
    {
        var expenses = await _context.Expenses
            .OrderByDescending(e => e.ExpenseDate)
            .ToListAsync();

        return Ok(expenses);
    }

    // GET: api/expenses/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Expense>> GetExpense(int id)
    {
        var expense = await _context.Expenses
            .FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        return Ok(expense);
    }

    // POST: api/expenses
    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense(
        Expense expense)
    {
        expense.Id = 0;

        _context.Expenses.Add(expense);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetExpense),
            new { id = expense.Id },
            expense
        );
    }

    // PUT: api/expenses/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateExpense(
        int id,
        Expense expense)
    {
        if (id != expense.Id)
        {
            return BadRequest();
        }

        var existingExpense =
            await _context.Expenses.FindAsync(id);

        if (existingExpense == null)
        {
            return NotFound();
        }

        existingExpense.Title =
            expense.Title;

        existingExpense.Amount =
            expense.Amount;

        existingExpense.Category =
            expense.Category;

        existingExpense.Description =
            expense.Description;

        existingExpense.ExpenseDate =
            expense.ExpenseDate;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/expenses/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense =
            await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        _context.Expenses.Remove(expense);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}