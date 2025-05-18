using Microsoft.AspNetCore.SignalR;

public class GroupMembership
{



    public int ProfileId { get; set; }
    public Profile Profile { get; set; }

    public int GroupId { get; set; }
    public Group Group { get; set; }

    public List<Transaction> Transactions { get; set; }

    public float GetBalance()
    {
        return Transactions?.Sum(t => t.Money) ?? 0;
    }

    public GroupMembership(int profileId, int groupId)
    {
        this.ProfileId = profileId;
        this.GroupId = groupId;
        Transactions = new List<Transaction>();
    }

    public GroupMembership()
    {
    }

    public void AddTransaction(Transaction transaction)
    {
        Transactions.Add(transaction);
    }
}