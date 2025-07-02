using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    public int Id { get; set; } // 🔁 Capitalized 'Id' for consistency

    [Required]
    public string Name { get; set; } = string.Empty;

    // 🔗 Foreign key to Department
    public int DepartmentId { get; set; }

    [ForeignKey("DepartmentId")]
    public Department? Department { get; set; }
}
