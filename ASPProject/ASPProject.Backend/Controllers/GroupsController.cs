// Controllers/GroupController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GroupsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
    {
        return await _context.Groups.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GroupWithMembersDto>> GetGroup(int id)
    {
        var group = await _context.Groups
            .Include(g => g.MemberProfiles)
                .ThenInclude(m => m.Profile)
            .Include(g => g.MemberProfiles)
                .ThenInclude(m => m.Transactions)
            .FirstOrDefaultAsync(g => g.Id == id);
        if (group == null)
        {
            return NotFound();
        }

        GroupWithMembersDto groups = new()
        {
            Id = group.Id,
            Name = group.Name,
            Members = group.MemberProfiles
                .Select(m => new GroupMemberDto
                {
                    ProfileId = m.ProfileId,
                    Name = m.Profile.Name,
                    Balance = _context.Transactions
                        .Where(t => t.GroupId == id && t.ProfileId == m.ProfileId)
                        .Sum(t => t.Money)
                 })
                .ToList()
        };

    return groups;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<GroupWithMembersDto>> DeleteGroup(int id)
    {
        var group = await _context.Groups
            .Include(g => g.MemberProfiles)
                .ThenInclude(m => m.Transactions) 
            .FirstOrDefaultAsync(g => g.Id == id);

        if (group == null)
        {
            return NotFound();
        }

        var transactions = group.MemberProfiles
            .SelectMany(m => m.Transactions)
            .ToList();
        
        if (transactions.Any())
        {
            _context.Transactions.RemoveRange(transactions);
        }

        _context.GroupMemberships.RemoveRange(group.MemberProfiles);

        _context.Groups.Remove(group);

    
        await _context.SaveChangesAsync();
        return NoContent(); 
     
       
    }


    [HttpGet("{id}/balance")]
    public async Task<ActionResult<float>> GetGroupBalance(int id)
    {
        var group = await _context.Groups.Include(g => g.MemberProfiles).ThenInclude(m => m.Profile).Include(g => g.MemberProfiles).ThenInclude(m => m.Transactions).FirstOrDefaultAsync(g => g.Id == id);

        if (group == null)
        {
            return NotFound();
        }
        float totalBalance = group.getBalance();
        return totalBalance;
    }

    [HttpGet("{id}/even-balances")]
    public async Task<ActionResult<List<TransactionDto>>> GetGroupEvenBalance(int id)
    {
        var group = await _context.Groups.Include(g => g.MemberProfiles).ThenInclude(m => m.Profile).Include(g => g.MemberProfiles).ThenInclude(m => m.Transactions).FirstOrDefaultAsync(g => g.Id == id);

        if (group == null)
        {
            return NotFound();
        }
        return Ok(
            group.CalculateTransactions().Select(t => new TransactionDto
            {
                Money = t.Money,
                Name = t.Name,
                SenderName = _context.Profiles.FirstOrDefault(p => p.Id == t.ProfileId)?.Name ?? "Unknown",
                RecipientName = _context.Profiles.FirstOrDefault(p => p.Id == t.RecipientProfileId)?.Name,
            })
          
        );
    }


    [HttpPost("{id}/update")]
    public async Task<ActionResult<GroupWithMembersDto>> UpdateGroups(int id, [FromBody] CreateGroupDto groupData)
    {
        Console.WriteLine("--hahah");

        if (string.IsNullOrEmpty(groupData.Name))
        {
            return BadRequest("Group name is required");
        }

        var group = await _context.Groups
            .Include(g => g.MemberProfiles)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (group == null)
        {
            return NotFound("Group not found");
        }

        group.setName(groupData.Name);

        if (group.MemberProfiles != null)
        {
            var membersToRemove = group.MemberProfiles
                .Where(m => !groupData.ProfileIds.Contains(m.ProfileId))
                .ToList();
            group.MemberProfiles.RemoveAll(m => membersToRemove.Select(r => r.ProfileId).Contains(m.ProfileId));

            var membersToAdd = groupData.ProfileIds
                .Where(pid => !group.MemberProfiles.Any(m => m.ProfileId == pid))
                .Select(pid =>
                {
                    var membership = new GroupMembership(pid, group.Id);
                    return membership;
                })
                .ToList();
            group.MemberProfiles.AddRange(membersToAdd);
 
        }

            await _context.SaveChangesAsync();

            var updatedGroup = await _context.Groups
                .Include(g => g.MemberProfiles)
                .ThenInclude(m => m.Profile) // If you want profile details
                .FirstOrDefaultAsync(g => g.Id == id);

            var result = new GroupWithMembersDto
            {
                Id = updatedGroup != null ? updatedGroup.Id : 0,
                Name = updatedGroup != null ? updatedGroup.Name : "",
                Members = updatedGroup != null ? updatedGroup.MemberProfiles.Select(m => new GroupMemberDto
                {
                    ProfileId = m.ProfileId,
                    Name = m.Profile.Name
                }).ToList() : []
            };

            return Ok(result);
        
        
    }


    [HttpPost]
    public async Task<ActionResult<GroupWithMembersDto>> CreateGroups([FromBody] CreateGroupDto groupData)
    {
        Console.WriteLine("--hahah");

         
        if (string.IsNullOrEmpty(groupData.Name))
        {
            return BadRequest("Group name is required");
        }

        Group group = new(groupData.Name);
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        foreach (int profileId in groupData.ProfileIds)
        {
            var profile = await _context.Profiles.FindAsync(profileId);
            if (profile != null)
            {
                GroupMembership membership = new()
                {
                    ProfileId = profileId,
                    GroupId = group.Id
                };
               _context.GroupMemberships.Add(membership);
            }
        }


        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, 
        new GroupWithMembersDto
        {
            Id = group.Id,
            Name = group.Name,
            Members = group.MemberProfiles.Select(m => new GroupMemberDto
            {
                ProfileId = m.ProfileId,
                Name = m.Profile.Name                
            }).ToList()
        });
    }
}