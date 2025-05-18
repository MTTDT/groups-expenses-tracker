public class Group
{

    public int Id { get; set; }
    public string Name { get; private set; }

    public List<GroupMembership> MemberProfiles { get; set; } = new();
    

    public Group() { MemberProfiles = new List<GroupMembership>(); }

    public Group(string name)
    {
        this.Name = name;
        MemberProfiles = new List<GroupMembership>();
    }
    public float getBalance()
    {
        return MemberProfiles?.Sum(m => m.GetBalance()) ?? 0;
    }
    
    public void setName(string name){this.Name = name;}

    public List<Transaction> CalculateTransactions()
    {
        float totalBalance = getBalance();
        float averageCost = totalBalance / MemberProfiles.Count;
        List<Transaction> suggestedTransactions = new List<Transaction>();
        List<GroupMembership> MemberProfilesCopy = new List<GroupMembership>(MemberProfiles);
        GroupMembership leastBalanceMember = MemberProfiles.OrderBy(m => m.GetBalance()).First();
        GroupMembership mostBalanceMember = MemberProfiles.OrderByDescending(m => m.GetBalance()).First();
        void evenBalances(GroupMembership leastBalanceMember, GroupMembership mostBalanceMember)
        {
            // float maxPossiblePayment = mostBalanceMember.GetBalance()  - suggestedTransactions.Where(t => t.RecipientProfileId == mostBalanceMember.ProfileId).Sum(m => m.Money) - averageCost;
            float maxPossiblePayment = mostBalanceMember.GetBalance() - averageCost;
            float leastBalance = leastBalanceMember.GetBalance();
            if (leastBalance < averageCost)
            {
                if (averageCost - leastBalance >= maxPossiblePayment)
                {
                    Transaction transaction = new Transaction(
                        maxPossiblePayment,
                        "Transaction to even balances",
                        leastBalanceMember.ProfileId,
                        this.Id,
                        mostBalanceMember.ProfileId
                    );

                    MemberProfilesCopy.Where(m => m.ProfileId == leastBalanceMember.ProfileId).First().AddTransaction(transaction);
                    suggestedTransactions.Add(transaction);


                }
                else
                {
                    Transaction transaction = new Transaction(
                        averageCost - leastBalance,
                        "Transaction to even balances",
                        leastBalanceMember.ProfileId,
                        this.Id,
                        mostBalanceMember.ProfileId
                    );

                    MemberProfilesCopy.Where(m => m.ProfileId == leastBalanceMember.ProfileId).First().AddTransaction(transaction);
                    suggestedTransactions.Add(transaction);
                }
                leastBalanceMember = MemberProfilesCopy.OrderBy(m => m.GetBalance()).First();
                mostBalanceMember = MemberProfilesCopy.OrderByDescending(m => m.GetBalance()).First();
                evenBalances(leastBalanceMember, mostBalanceMember);
            }
            else return;
        }

        evenBalances(leastBalanceMember, mostBalanceMember);
        return suggestedTransactions;
    }
}