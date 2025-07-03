using FluentValidation;
using Backend.DTOs;

namespace Backend.Validators;


public class JobRequestCreateDtoValidator : AbstractValidator<JobRequestCreateDto>
{
    public JobRequestCreateDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.PositionCount)
            .GreaterThan(0).WithMessage("Position count must be greater than zero.");

        RuleFor(x => x.MinQualification)
            .NotEmpty().WithMessage("Minimum qualification is required.");

        RuleFor(x => x.MinExperience)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum experience must be 0 or more.");

        RuleFor(x => x.MinSalary)
    .NotEmpty().WithMessage("Minimum salary is required.")
    .Matches(@"^\d+(\.\d{1,2})?$").WithMessage("Minimum salary must be a valid number.");

RuleFor(x => x.MaxSalary)
    .NotEmpty().WithMessage("Maximum salary is required.")
    .Matches(@"^\d+(\.\d{1,2})?$").WithMessage("Maximum salary must be a valid number.");

// 👇 Add this after the above salary rules
RuleFor(x => x)
    .Custom((dto, context) =>
    {
        if (decimal.TryParse(dto.MinSalary, out decimal minSalary) &&
            decimal.TryParse(dto.MaxSalary, out decimal maxSalary))
        {
            if (minSalary <= 0)
                context.AddFailure("MinSalary", "Minimum salary must be greater than zero.");

            if (maxSalary <= minSalary)
                context.AddFailure("MaxSalary", "Maximum salary must be greater than minimum salary.");

            if (minSalary >= maxSalary)
                context.AddFailure("MinSalary", "Minimum salary must be less than maximum salary.");
        }
    });

        RuleFor(x => x.RequesterName)
            .NotEmpty().WithMessage("Requester name is required.")
            .MaximumLength(100).WithMessage("Requester name is too long.");

        RuleFor(x => x.DepartmentName)
            .NotEmpty().WithMessage("Department name is required.")
            .MaximumLength(100).WithMessage("Department name is too long.");
    }
}