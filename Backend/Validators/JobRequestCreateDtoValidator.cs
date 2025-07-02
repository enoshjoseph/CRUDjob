using FluentValidation;
using Backend.DTOs;

namespace Backend.Validators
{
    public class JobRequestCreateDtoValidator : AbstractValidator<JobRequestCreateDto>
    {
        public JobRequestCreateDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(1000);

            RuleFor(x => x.PositionCount)
                .GreaterThan(0).WithMessage("Position count must be greater than 0.");

            RuleFor(x => x.MinQualification)
                .NotEmpty().WithMessage("Minimum qualification is required.");

            RuleFor(x => x.MinExperience)
                .GreaterThanOrEqualTo(0).WithMessage("Minimum experience must be non-negative.");

            RuleFor(x => x.SalaryRange)
                .NotEmpty().WithMessage("Salary range is required.");

            RuleFor(x => x.RequestedBy)
                .GreaterThan(0).WithMessage("RequestedBy (user ID) must be valid.");

            RuleFor(x => x.DepartmentId)
                .GreaterThan(0).WithMessage("DepartmentId must be valid.");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required.")
                .Must(s => new[] { "Pending", "Approved", "Rejected" }.Contains(s))
                .WithMessage("Status must be one of: Pending, Approved, Rejected.");
        }
    }
}
