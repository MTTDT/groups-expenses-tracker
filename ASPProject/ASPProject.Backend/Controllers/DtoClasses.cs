public class GroupWithMembersDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public float Balance { get; set; }
    public required List<GroupMemberDto> Members { get; set; }
}

public class GroupMemberDto
{
    public int Id { get; set; }
    public int ProfileId { get; set; }
    public required string Name { get; set; }
    public float Balance { get; set; }
}


public class CreateGroupDto
{
    public required string Name { get; set; }
    public required List<int> ProfileIds { get; set; }
}

public class CreateTransactionDto
{
    public int GroupId { get; set; }
    public int ProfileId { get; set; }
    public int? RecipientProfileId { get; set; }
    public float Money { get; set; }
    public required string Name { get; set; }
}
public class TransactionDto
{

    public float Money { get; set; }
    public required string Name { get; set; }
    public required string SenderName { get; set; }
    public string? RecipientName { get; set; }
}