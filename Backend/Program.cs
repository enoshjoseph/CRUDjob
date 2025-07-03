using Microsoft.EntityFrameworkCore;
using Backend.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Backend.Validators;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add CORS policy for localhost
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy
            .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost") // allows any localhost port
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ✅ Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<JobRequestCreateDtoValidator>();

// ✅ Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Add this line to enable CORS
app.UseCors("AllowLocalhost");

app.UseAuthorization();
app.MapControllers();
app.Run();
