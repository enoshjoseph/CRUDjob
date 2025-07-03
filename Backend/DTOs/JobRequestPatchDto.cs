namespace Backend.DTOs
{
    public class JobRequestPatchDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? PositionCount { get; set; }
        public string? MinQualification { get; set; }
        public int? MinExperience { get; set; }
        public string? MinSalary { get; set; }
        public string? MaxSalary { get; set; }
        public string? RequesterName { get; set; }
        public string? DepartmentName { get; set; }
    }
}
