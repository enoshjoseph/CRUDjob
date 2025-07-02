using Backend.DTOs;
using Backend.Data;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Backend.Validators
{
    public class UserCreateDtoValidator : AbstractValidator<UserCreateDto>
    {
        public UserCreateDtoValidator(AppDbContext context)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name must be less than 100 characters.");

            RuleFor(x => x.DepartmentId)
                .NotEmpty().WithMessage("Department ID is required.");
                // .MustAsync(async (id, cancellation) =>
                // {
                //     return await context.Departments.AnyAsync(d => d.Id == id, cancellation);
                // }).WithMessage("The specified Department ID does not exist.");
        }
    }
}
