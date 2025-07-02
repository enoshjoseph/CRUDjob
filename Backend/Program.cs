using Microsoft.EntityFrameworkCore;
using Backend.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Backend.Validators;

var builder = WebApplication.CreateBuilder(args);

// 🔌 Add DbContext with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ FluentValidation registration (Register all validators from this assembly once)
// ✅ FluentValidation registration
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<UserCreateDtoValidator>(); // Explicitly register your validator
 // Will pick up DepartmentCreateDtoValidator too if in same assembly

// ✅ Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🚦 Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Commented out HTTPS redirection since you're testing with Postman via HTTP
// app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.Run();
