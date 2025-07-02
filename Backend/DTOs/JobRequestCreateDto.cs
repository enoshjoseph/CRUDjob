namespace Backend.DTOs
{
    public class JobRequestCreateDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int PositionCount { get; set; }
        public string MinQualification { get; set; }
        public int MinExperience { get; set; }
        public string SalaryRange { get; set; }

        public int RequestedBy { get; set; }
        public int DepartmentId { get; set; }

        public string Status { get; set; } = "Pending";
    }
}
