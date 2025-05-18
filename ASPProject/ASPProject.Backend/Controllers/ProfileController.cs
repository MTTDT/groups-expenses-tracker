using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Profile>>> GetProfiles()
    {
        return await _context.Profiles.ToListAsync();
    }

    // [HttpGet("{id}")]
    // public async Task<ActionResult<List<Profile>>> GetProfilesById(int id)
    // {
    //     var group = await _context.Groups.FindAsync(id);

    //     if (group == null)
    //     {
    //         return NotFound();
    //     }

    //     return group.GetAll();
    // }

    [HttpPost]
    public async Task<ActionResult<Profile>> CreateProfile([FromBody] string name)
    {
        Profile profile = new Profile(name);
        _context.Profiles.Add(profile);
        await _context.SaveChangesAsync();
        Console.Write("connection happened");
        return CreatedAtAction(nameof(GetProfiles), new { id = profile.Id }, profile);
    }
}