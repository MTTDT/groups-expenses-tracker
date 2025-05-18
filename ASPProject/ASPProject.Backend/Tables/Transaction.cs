using System.Text.Json.Serialization;

public class Transaction
{
    public int Id { get; set; }
    public float Money { get; set; }
    public string Name { get; set; }

    public int? RecipientProfileId { get; set; }


    [JsonIgnore]
    public GroupMembership GroupMember { get; set; }
    public int ProfileId { get; set; }
    [JsonIgnore]
    public int GroupId { get; set; }

    protected Transaction() { }
    public Transaction(float amount, string name, int profileId, int groupId, int? recipientProfileId = null)
    {
        this.Money = amount;
        this.Name = name;
        this.ProfileId = profileId;
        this.GroupId = groupId;
        this.RecipientProfileId = recipientProfileId;
    }



}
