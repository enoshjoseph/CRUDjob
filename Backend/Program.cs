using Microsoft.EntityFrameworkCore;
using Backend.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Backend.Validators; // ✅ Only if JobRequestCreateDtoValidator is inside this namespace

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy
            .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost") // ✅ allows any localhost port
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// 🔌 Add DbContext with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ FluentValidation setup
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<JobRequestCreateDtoValidator>(); // ✅ Fix here

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

app.UseAuthorization();
app.MapControllers();
app.Run();
