using System.ComponentModel.DataAnnotations;
namespace Backend.Models;
public class Department
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    // Optional navigation properties (if needed)
    // public ICollection<User> Users { get; set; }
    // public ICollection<JobRequest> JobRequests { get; set; }
}
