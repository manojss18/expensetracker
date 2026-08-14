namespace ExpenseTracker.Api.Models;

public class Income
{
    public int Id { get; set; }

    public string Source { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime IncomeDate { get; set; }
}