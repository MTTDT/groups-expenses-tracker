using System.Data.SqlTypes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TransactionController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transactions.ToListAsync();
    }

    [HttpGet("group/{groupId}/profile/{profileId}")][Produces("application/json")]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetGroupMemberTransactions(int groupId, int profileId)
    {
        Boolean groupMemberExists = await _context.GroupMemberships.AnyAsync(gm => gm.ProfileId == profileId && gm.GroupId == groupId);
        
        if (!groupMemberExists)
        {
            return NotFound("Profile is not a member of the specified group");
        }

        List<Transaction> transactions = await _context.Transactions
            .Where(t => t.ProfileId == profileId && t.GroupId == groupId)
            .ToListAsync();

        
        

        return Ok(
            transactions.Select(t => new TransactionDto
            {
                Money = t.Money,
                Name = t.Name,
                SenderName = t.Money < 0 ? "" : _context.Profiles.FirstOrDefault(p => p.Id == t.ProfileId)?.Name ?? "Unknown",
                RecipientName = t.Money < 0 ? _context.Profiles.FirstOrDefault(p => p.Id == t.ProfileId)?.Name ?? "Unknown" : _context.Profiles.FirstOrDefault(p => p.Id == t.RecipientProfileId)?.Name,
            })

        );
    }

    [HttpGet("group/{groupId}/profile/{profileId}/sum")][Produces("application/json")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetGroupMemberTransactionsSum(int groupId, int profileId)
    {
        Boolean groupMemberExists = await _context.GroupMemberships.AnyAsync(gm => gm.ProfileId == profileId && gm.GroupId == groupId);
        
        if (!groupMemberExists)
        {
            return NotFound("Profile is not a member of the specified group");
        }

        float sum = await _context.Transactions
            .Where(t => t.ProfileId == profileId && t.GroupId == groupId)
            .SumAsync(t => t.Money);
     

        return Ok(sum);
    }

    [HttpPost]
    public async Task<ActionResult<Profile>> CreateTransaction(CreateTransactionDto transactionDto)
    {
        if (transactionDto == null)
        {
            return BadRequest("Transaction data is required");
        }
       


    
        var sendTransaction = new Transaction(
            transactionDto.Money, 
            transactionDto.Name, 
            transactionDto.ProfileId, 
            transactionDto.GroupId, 
            transactionDto.RecipientProfileId);

        _context.Transactions.Add(sendTransaction);
        if(transactionDto.RecipientProfileId != null)
        {
            var receivedTransaction = new Transaction(
                -transactionDto.Money, 
                transactionDto.Name + " (received)", 
                transactionDto?.RecipientProfileId ?? 0, 
                transactionDto?.GroupId ?? 0
            );

        _context.Transactions.Add(receivedTransaction);
        }


        // Save both transactions
        await _context.SaveChangesAsync();

        // Update sender's membership balance if needed
        var senderMembership = await _context.GroupMemberships.ToListAsync();



      
        
        Console.Write("connection happened");
        return CreatedAtAction(nameof(GetTransactions), new { id = sendTransaction.Id }, sendTransaction);
    }
}