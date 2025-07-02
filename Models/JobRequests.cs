using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class JobRequest
{
    [Key] // ✅ Capital 'K' for [Key] attribute
    public int RequestId { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public int PositionCount { get; set; }
    public string MinQualification { get; set; }
    public int MinExperience { get; set; }
    public string SalaryRange { get; set; }

    // 🔗 Foreign key to User table
    public int RequestedBy { get; set; }

    [ForeignKey("RequestedBy")]
    public User? User { get; set; }

    // 🔗 Foreign key to Department table
    public int DepartmentId { get; set; }

    [ForeignKey("DepartmentId")]
    public Department? Department { get; set; }

    public DateTime RequestDate { get; set; } = DateTime.Now;
    public string Status { get; set; } = "Pending";
}
