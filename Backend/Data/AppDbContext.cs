using Microsoft.EntityFrameworkCore;
using Backend.Models; // Imports your JobRequest, User, Department models

namespace Backend.Data // ✅ CORRECT: Place DbContext in a separate Data namespace
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<JobRequest> JobRequests { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
    }
}
