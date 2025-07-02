using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobRequestController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ CREATE: POST /api/jobrequest
        [HttpPost]
        public async Task<ActionResult<JobRequest>> CreateJob(JobRequestCreateDto dto)
        {
            var job = new JobRequest
            {
                Title = dto.Title,
                Description = dto.Description,
                PositionCount = dto.PositionCount,
                MinQualification = dto.MinQualification,
                MinExperience = dto.MinExperience,
                SalaryRange = dto.SalaryRange,
                RequestedBy = dto.RequestedBy,
                DepartmentId = dto.DepartmentId,
                Status = dto.Status,
                RequestDate = DateTime.UtcNow
            };

            _context.JobRequests.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobById), new { id = job.RequestId }, job);
        }

        // ✅ READ ALL: GET /api/jobrequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobRequestDto>>> GetAllJobs()
        {
            var jobs = await _context.JobRequests
                .Include(j => j.User)
                .Include(j => j.Department)
                .Select(j => new JobRequestDto
                {
                    RequestId = j.RequestId,
                    Title = j.Title,
                    Description = j.Description,
                    PositionCount = j.PositionCount,
                    MinQualification = j.MinQualification,
                    MinExperience = j.MinExperience,
                    SalaryRange = j.SalaryRange,
                    RequestedByName = j.User.Name,
                    DepartmentName = j.Department.Name,
                    RequestDate = j.RequestDate,
                    Status = j.Status
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // ✅ READ BY ID: GET /api/jobrequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<JobRequestDto>> GetJobById(int id)
        {
            var job = await _context.JobRequests
                .Include(j => j.User)
                .Include(j => j.Department)
                .Where(j => j.RequestId == id)
                .Select(j => new JobRequestDto
                {
                    RequestId = j.RequestId,
                    Title = j.Title,
                    Description = j.Description,
                    PositionCount = j.PositionCount,
                    MinQualification = j.MinQualification,
                    MinExperience = j.MinExperience,
                    SalaryRange = j.SalaryRange,
                    RequestedByName = j.User.Name,
                    DepartmentName = j.Department.Name,
                    RequestDate = j.RequestDate,
                    Status = j.Status
                })
                .FirstOrDefaultAsync();

            if (job == null)
                return NotFound();

            return Ok(job);
        }

        // ✅ READ BY STATUS: GET /api/jobrequest/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<JobRequestDto>>> GetJobsByStatus(string status)
        {
            var jobs = await _context.JobRequests
                .Include(j => j.User)
                .Include(j => j.Department)
                .Where(j => j.Status.ToLower() == status.ToLower())
                .Select(j => new JobRequestDto
                {
                    RequestId = j.RequestId,
                    Title = j.Title,
                    Description = j.Description,
                    PositionCount = j.PositionCount,
                    MinQualification = j.MinQualification,
                    MinExperience = j.MinExperience,
                    SalaryRange = j.SalaryRange,
                    RequestedByName = j.User.Name,
                    DepartmentName = j.Department.Name,
                    RequestDate = j.RequestDate,
                    Status = j.Status
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // ✅ UPDATE: PUT /api/jobrequest/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, JobRequestCreateDto dto)
        {
            var job = await _context.JobRequests.FindAsync(id);
            if (job == null)
                return NotFound();

            job.Title = dto.Title;
            job.Description = dto.Description;
            job.PositionCount = dto.PositionCount;
            job.MinQualification = dto.MinQualification;
            job.MinExperience = dto.MinExperience;
            job.SalaryRange = dto.SalaryRange;
            job.RequestedBy = dto.RequestedBy;
            job.DepartmentId = dto.DepartmentId;
            job.Status = dto.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: DELETE /api/jobrequest/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.JobRequests.FindAsync(id);
            if (job == null)
                return NotFound();

            _context.JobRequests.Remove(job);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
