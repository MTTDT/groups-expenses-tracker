using System.Text.Json.Serialization;

public class Profile
{
    public int Id { get; set; }
    public string Name { get; private set; }

    public List<GroupMembership> GroupMemberships { get; set; } = new();

    public Profile(string name)
    {
        this.Name = name;
    }

    public Profile(string name, Group group)
    {
        this.Group = group;
        this.Name = name;
        this.GroupId = group.Id;
    }
    protected Profile() { }

    
    public int GroupId { get; set; }
    
    [JsonIgnore]
    public Group Group { get; set; }
    

}