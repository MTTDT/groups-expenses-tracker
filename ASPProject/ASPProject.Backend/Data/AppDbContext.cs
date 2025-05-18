// Data/AppDbContext.cs
using System.Formats.Tar;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupMembership> GroupMemberships { get; set; }
    
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {


        modelBuilder.Entity<GroupMembership>()
            .HasKey(pg => new { pg.ProfileId, pg.GroupId });

        modelBuilder.Entity<GroupMembership>()
            .HasOne(pg => pg.Profile)
            .WithMany(p => p.GroupMemberships)
            .HasForeignKey(pg => pg.ProfileId);

        modelBuilder.Entity<GroupMembership>()
            .HasOne(pg => pg.Group)
            .WithMany(g => g.MemberProfiles)
            .HasForeignKey(pg => pg.GroupId);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.GroupMember)
            .WithMany(g => g.Transactions)
            .HasForeignKey(t => new { t.ProfileId, t.GroupId })
            .HasPrincipalKey(gm => new { gm.ProfileId, gm.GroupId });
            
    }
}