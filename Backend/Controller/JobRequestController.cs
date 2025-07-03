using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.DTOs;
using Backend.Models;
using Backend.Data;

namespace Backend.Controller
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

       [HttpPost]
public async Task<ActionResult<JobRequest>> CreateJobRequest(JobRequestCreateDto dto)
{
    var exists = await _context.JobRequests.AnyAsync(j =>
        j.Title.ToLower() == dto.Title.ToLower() &&
        j.DepartmentName.ToLower() == dto.DepartmentName.ToLower());

    if (exists)
        return Conflict($"A job with title '{dto.Title}' already exists in department '{dto.DepartmentName}'.");
    // Validate salary input
    if (!decimal.TryParse(dto.MinSalary, out var minSalary))
        return BadRequest("MinSalary must be a valid number.");

    if (!decimal.TryParse(dto.MaxSalary, out var maxSalary))
        return BadRequest("MaxSalary must be a valid number.");

    if (minSalary <= 0)
        return BadRequest("MinSalary must be greater than zero.");

    if (maxSalary <= minSalary)
        return BadRequest("MaxSalary must be greater than MinSalary.");

    // Map DTO to entity
    var job = new JobRequest
    {
        Title = dto.Title,
        Description = dto.Description,
        PositionCount = dto.PositionCount,
        MinQualification = dto.MinQualification,
        MinExperience = dto.MinExperience,
        MinSalary = dto.MinSalary,
        MaxSalary = dto.MaxSalary,
        RequesterName = dto.RequesterName,
        DepartmentName = dto.DepartmentName,
        Status = "Pending", // ✅ default status
        RequestDate = dto.RequestDate ?? DateTime.UtcNow // ✅
 // ✅ current timestamp
    };

    _context.JobRequests.Add(job);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetJobById), new { id = job.RequestId }, job);
}


        // ✅ READ ALL: GET /api/jobrequest
[HttpGet]
public async Task<ActionResult<object>> GetAllJobs(int page = 1, int pageSize = 10)
{
    if (page <= 0) page = 1;
    if (pageSize <= 0) pageSize = 10;

    var totalItems = await _context.JobRequests.CountAsync();

    var jobs = await _context.JobRequests
        .OrderByDescending(j => j.RequestDate) // optional sorting
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(j => new JobRequestDto
        {
             RequestId = j.RequestId,
            Title = j.Title,
            Description = j.Description,
            PositionCount = j.PositionCount,
            MinQualification = j.MinQualification,
            MinExperience = j.MinExperience,
            MinSalary = j.MinSalary,
            MaxSalary =   j.MaxSalary,
            SalaryRange = $"{j.MinSalary}- {j.MaxSalary}",
            RequestedByName = j.RequesterName, // 👈 fix
            DepartmentName = j.DepartmentName,
            RequestDate = j.RequestDate,
            Status = j.Status
        })
        .ToListAsync();

    return Ok(new
    {
        currentPage = page,
        pageSize = pageSize,
        totalItems = totalItems,
        totalPages = (int)Math.Ceiling((double)totalItems / pageSize),
        data = jobs
    });
}


        // ✅ READ BY ID: GET /api/jobrequest/{id}
       [HttpGet("{id}")]
public async Task<ActionResult<JobRequestDto>> GetJobById(int id)
{
    var job = await _context.JobRequests
        .Where(j => j.RequestId == id)
        .Select(j => new JobRequestDto
        {
            RequestId = j.RequestId,
            Title = j.Title,
            Description = j.Description,
            PositionCount = j.PositionCount,
            MinQualification = j.MinQualification,
            MinExperience = j.MinExperience,
            MinSalary = j.MinSalary,
            MaxSalary = j.MaxSalary,
            SalaryRange = $"{j.MinSalary}- {j.MaxSalary}",
            RequestedByName = j.RequesterName,
            DepartmentName = j.DepartmentName,
            RequestDate = j.RequestDate,
            Status = j.Status
        })
        .FirstOrDefaultAsync();

    if (job == null)
        return NotFound();

    return Ok(job);
}


        //✅ READ BY STATUS: GET /api/jobrequest/status/{status}
         [HttpGet("status/{status}")]
        // public async Task<ActionResult<IEnumerable<JobRequestDto>>> GetJobsByStatus(string status)
        // {
        //     var jobs = await _context.JobRequests
        //         .Include(j => j.User)
        //         .Include(j => j.Department)
        //         .Where(j => j.Status.ToLower() == status.ToLower())
        //         .Select(j => new JobRequestDto
        //         {
        //             RequestId = j.RequestId,
        //             Title = j.Title,
        //             Description = j.Description,
        //             PositionCount = j.PositionCount,
        //             MinQualification = j.MinQualification,
        //             MinExperience = j.MinExperience,
        //             SalaryRange = j.SalaryRange,
        //             RequestedByName = j.User.Name,
        //             DepartmentName = j.Department.Name,
        //             RequestDate = j.RequestDate,
        //             Status = j.Status
        //         })
        //         .ToListAsync();

        //     return Ok(jobs);
        // }

        // ✅ UPDATE: PUT /api/jobrequest/{id}
        [HttpPut("{id}")]
public async Task<IActionResult> UpdateJob(int id, JobRequestCreateDto dto)
{
    var job = await _context.JobRequests.FindAsync(id);
    if (job == null)
        return NotFound("Job not found.");

    // Check for duplicate (same title & department, excluding current job)
    bool duplicateExists = await _context.JobRequests
        .AnyAsync(j => j.RequestId != id && j.Title == dto.Title && j.DepartmentName == dto.DepartmentName);

    if (duplicateExists)
        return BadRequest("A job with the same title already exists in this department.");

    // Optional: validate salary
    if (!decimal.TryParse(dto.MinSalary, out var minSalary))
        return BadRequest("MinSalary must be a valid number.");
    if (!decimal.TryParse(dto.MaxSalary, out var maxSalary))
        return BadRequest("MaxSalary must be a valid number.");
    if (minSalary <= 0 || maxSalary <= minSalary)
        return BadRequest("Salary range is invalid.");

    // Update fields
    job.Title = dto.Title;
    job.Description = dto.Description;
    job.PositionCount = dto.PositionCount;
    job.MinQualification = dto.MinQualification;
    job.MinExperience = dto.MinExperience;
    job.MinSalary = dto.MinSalary;
    job.MaxSalary = dto.MaxSalary;
    job.RequesterName = dto.RequesterName;
    job.DepartmentName = dto.DepartmentName;
    job.Status = "Pending"; // reset or preserve as needed

    await _context.SaveChangesAsync();

    return Ok("updated successfully");
}
[HttpPatch("{id}")]
public async Task<IActionResult> PatchJob(int id, JobRequestPatchDto dto)
{
    var job = await _context.JobRequests.FindAsync(id);
    if (job == null)
        return NotFound("Job not found.");

    // Only check for duplicates if Title is being updated
    if (!string.IsNullOrEmpty(dto.Title) && !string.IsNullOrEmpty(dto.DepartmentName))
    {
        var duplicate = await _context.JobRequests
            .Where(j => j.RequestId != id && j.Title == dto.Title && j.DepartmentName == dto.DepartmentName)
            .FirstOrDefaultAsync();

        if (duplicate != null)
            return BadRequest("A job with this title already exists in the specified department.");
    }

    // Apply updates if fields are provided
    if (dto.Title != null) job.Title = dto.Title;
    if (dto.Description != null) job.Description = dto.Description;
    if (dto.PositionCount.HasValue) job.PositionCount = dto.PositionCount.Value;
    if (dto.MinQualification != null) job.MinQualification = dto.MinQualification;
    if (dto.MinExperience.HasValue) job.MinExperience = dto.MinExperience.Value;
    if (dto.MinSalary != null) job.MinSalary = dto.MinSalary;
    if (dto.MaxSalary != null) job.MaxSalary = dto.MaxSalary;
    if (dto.RequesterName != null) job.RequesterName = dto.RequesterName;
    if (dto.DepartmentName != null) job.DepartmentName = dto.DepartmentName;

    await _context.SaveChangesAsync();
    return Ok("updated successfully");
}

        // ✅ DELETE: DELETE /api/jobrequest/{id}
        [HttpDelete("{id}")]
public async Task<IActionResult> DeleteJobRequest(int id)
{
    var job = await _context.JobRequests.FindAsync(id);

    if (job == null)
        return NotFound("Job request not found.");

    _context.JobRequests.Remove(job);
    await _context.SaveChangesAsync();

    return Ok("Job request deleted successfully.");; // or return Ok("Deleted successfully");
}

    }
}
