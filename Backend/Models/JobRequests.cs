using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models;
public class JobRequest
{
    [Key]
    public int RequestId { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public int PositionCount { get; set; }
    public string MinQualification { get; set; }
    public int MinExperience { get; set; }
    public string MinSalary { get; set; }
    public string MaxSalary { get; set; }

    public string RequesterName { get; set; } // ✅ Store requester's name directly

    public string DepartmentName { get; set; }

    public DateTime RequestDate { get; set; } = DateTime.Now;
    public string Status { get; set; } = "Pending";
}

