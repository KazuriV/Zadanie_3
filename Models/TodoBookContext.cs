using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models
{
    public class TodoBookContext : DbContext
    {
        public TodoBookContext(DbContextOptions<TodoBookContext> options)
            : base(options)
        {
        }
        public DbSet<TodoBook> TodoBooks { get; set; }
    }
}
