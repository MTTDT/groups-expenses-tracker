using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("MyInMemoryDb"));

builder.Services.AddControllers(); // Add this to register controllers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000") // Add your frontend URLs
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseHttpsRedirection();
app.MapControllers(); // Add this to map controller routes

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    Profile profile1 = new Profile("Steponas");
    Profile profile2 = new Profile("Jonas");
    Profile profile3 = new Profile("Petras");
    Profile profile4 = new Profile("Saulius");
    context.Profiles.AddRange(
        profile1,
        profile2,       
        profile3,
        profile4
    );
    Group group = new Group("Group 1");

    GroupMembership groupMembership1 = new GroupMembership(profile1.Id, group.Id);
    GroupMembership groupMembership2 = new GroupMembership(profile2.Id, group.Id);
    GroupMembership groupMembership3 = new GroupMembership(profile3.Id, group.Id);
    groupMembership1.AddTransaction(new Transaction(10, "transaction1", profile1.Id, group.Id));
    groupMembership1.AddTransaction(new Transaction(20, "transaction2", profile2.Id, group.Id));
    groupMembership1.AddTransaction(new Transaction(30, "transaction3", profile3.Id, group.Id));
    group.MemberProfiles.Add(groupMembership1);
    group.MemberProfiles.Add(groupMembership2);
    group.MemberProfiles.Add(groupMembership3);

    context.Groups.AddRange(
        new Group("Group 1")
    );
    


    context.SaveChanges();
}

app.Run();






