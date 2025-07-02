using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<UserCreateDto> _validator;

        public UsersController(AppDbContext context, IValidator<UserCreateDto> validator)
        {
            _context = context;
            _validator = validator;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return user;
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<UserReadDto>> CreateUser(UserCreateDto dto)
        {
            // Manual validation (sync rules)
            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid)
                return BadRequest(result.Errors);

            // Manual async validation for department
            bool deptExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!deptExists)
                return BadRequest(new { error = "The specified Department ID does not exist." });

            var user = new User
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var createdUser = await _context.Users
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            var userDto = new UserReadDto
            {
                Id = createdUser.Id,
                Name = createdUser.Name,
                DepartmentId = createdUser.DepartmentId,
                DepartmentName = createdUser.Department?.Name
            };

            return CreatedAtAction(nameof(GetUser), new { id = userDto.Id }, userDto);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.Id)
                return BadRequest();

            _context.Entry(updatedUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(u => u.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
