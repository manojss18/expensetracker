using ExpenseTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Expense> Expenses { get; set; }

    public DbSet<Income> Incomes { get; set; }

    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>()
            .HasData(
                new Category
                {
                    Id = 1,
                    Name = "Food"
                },
                new Category
                {
                    Id = 2,
                    Name = "Bills"
                },
                new Category
                {
                    Id = 3,
                    Name = "Transport"
                },
                new Category
                {
                    Id = 4,
                    Name = "Entertainment"
                },
                new Category
                {
                    Id = 5,
                    Name = "Shopping"
                },
                new Category
                {
                    Id = 6,
                    Name = "Health"
                },
                new Category
                {
                    Id = 7,
                    Name = "Other"
                }
            );
    }
}