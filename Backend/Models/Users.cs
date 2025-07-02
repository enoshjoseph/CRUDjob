using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models;
public class User
{
    [Key]
    public int Id { get; set; } // 🔁 Capitalized 'Id' for consistency

    [Required]
    public string Name { get; set; }

    // 🔗 Foreign key to Department
    public int DepartmentId { get; set; }

    [ForeignKey("DepartmentId")]
    public Department? Department { get; set; }
}
