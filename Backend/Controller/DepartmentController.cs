using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/department
        [HttpGet]
        public IActionResult GetAll()
        {
            var departments = _context.Departments
                .Select(d => new DepartmentReadDto
                {
                    Id = d.Id,
                    Name = d.Name
                })
                .ToList();

            return Ok(departments);
        }

        // GET: api/department/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var department = _context.Departments.Find(id);

            if (department == null)
                return NotFound();

            return Ok(new DepartmentReadDto
            {
                Id = department.Id,
                Name = department.Name
            });
        }

        // POST: api/department
        [HttpPost]
        public IActionResult Create([FromBody] DepartmentCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Department name is required.");

            var department = new Department
            {
                Name = dto.Name
            };

            _context.Departments.Add(department);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = department.Id }, new DepartmentReadDto
            {
                Id = department.Id,
                Name = department.Name
            });
        }

        // PUT: api/department/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] DepartmentCreateDto dto)
        {
            var department = _context.Departments.Find(id);
            if (department == null)
                return NotFound();

            department.Name = dto.Name;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/department/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var department = _context.Departments.Find(id);
            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
