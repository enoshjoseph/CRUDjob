namespace Backend.DTOs
{
    public class JobRequestDto
    {
        public int RequestId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int PositionCount { get; set; }
        public string MinQualification { get; set; }
        public int MinExperience { get; set; }
        public string MinSalary { get; set; }
        public string MaxSalary { get; set; }
        public string SalaryRange { get; set; }

        public string RequestedByName { get; set; }     // From User
        public string DepartmentName { get; set; }      // From Department

        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
    }
}
