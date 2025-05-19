import { useEffect, useState, useRef } from "react";
import CreateTransaction from "./CreateTransaction";
import GroupMemberTransaction from "./GroupMemberTransacions";
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import TransactionLogToEven from "./TransactionLogToEven";

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default function ProfileList({group, setReloadBalance}:{group: Group, setReloadBalance: React.Dispatch<React.SetStateAction<boolean>>}){
    const [loadingProfiles, setLoadingProfiles] = useState<boolean>(true)
    const [openTransactionCreate, setOpenTransactionCreate] = useState<boolean>(false)
    const [openTransactionView, setOpenTransactionView] = useState<boolean>(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [activeProfileId, setActiveProfileId] = useState<number>(0)
    const [profileBalances, setProfileBalances] = useState<Record<number, number>>({})
    const [reloadSums, setReloadSums] = useState<boolean>(false)
    const chartRef = useRef<Chart<"pie", number[], string> | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [transactionLog, setTransactionLog] = useState<Transaction[]>([])
    const [transactionLogOpen, setTransactionLogOpen] = useState<boolean>(false)
    const [loadingTransactionLog, setLoadingTransactionLog] = useState<boolean>(false)

    

    const profiles: Profile[] = group.members

    useEffect(() => {
        setReloadSums(false)
        const fetchBalances = async () => {
            const balances: Record<number, number> = {};
            for (const p of profiles) {
                try {
                    const res = await fetch(`http://localhost:5167/api/transaction/group/${group.id}/profile/${p.profileId}/sum`)
                    balances[p.profileId] = await res.json()
                } catch (err) {
                    console.error("Failed to fetch balance:", err)
                    balances[p.profileId] = 0
                }
            }
            setProfileBalances(balances)
        }
        
        fetchBalances()
    }, [reloadSums])

    const generateDistinctColors = (count: number): string[] => {
        const colors: string[] = [];
        const hueStep = 360 / count; // Distribute hues evenly
        
        for (let i = 0; i < count; i++) {
          const hue = Math.floor(i * hueStep);
          // Use HSL color with fixed saturation and lightness for consistency
          const color = `hsla(${hue}, 70%, 60%, 0.7)`;
          colors.push(color);
        }
        
        return colors;
      };
      
    useEffect(() => {

        async function getTransactionLog(){
            setLoadingTransactionLog(true);
            try{
                const res = await fetch(`http://localhost:5167/api/groups/${group.id}/even-balances`)
                const data: Transaction[] = await res.json()
                setTransactionLog(data)
                setTransactionLogOpen(true)
                setLoadingTransactionLog(false);
            }catch(err){
                console.error("failed to get transactions: ",err)
            }
        }
        getTransactionLog()


        if (profiles.length === 0 || Object.keys(profileBalances).length === 0) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const labels = profiles.map(p => p.name);
        const data = profiles.map(p => profileBalances[p.profileId] || 0);
        const backgroundColors = generateDistinctColors(profiles.length);
        
       

        chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: "transparent"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [profiles, profileBalances]);
    function handleViewTransactions(profileId: number, groupId: number){
        async function getTransactions(){
            setOpenTransactionView(false)
            try{
               
                const res = await fetch(`http://localhost:5167/api/transaction/group/${groupId}/profile/${profileId}`)
                const data: Transaction[] = await res.json()
                setTransactions(data)
                setActiveProfileId(profileId)
                setOpenTransactionView(true)
            }catch(err){
                console.error("failed to get transactions: ",err)
            }
        }
        getTransactions()
    }

        
    function handleCreateTransaction(amount: number, profileId: number, name: string, recipientProfileId?: number){
        async function createTransaction(){
            try{
                const transaction: any = {
                    groupId: group.id,
                    profileId: profileId,
                    money: amount,
                    name: name
                  };
            
                  if (recipientProfileId) {
                    transaction.recipientProfileId = recipientProfileId;
                  }
                
                const res = await fetch('http://localhost:5167/api/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transaction)
                })
                const data: Transaction = await res.json()
                setReloadBalance(true)
                setReloadSums(true)
                setOpenTransactionCreate(false)
            }catch(err){
                console.error("failed to add transaction: ",err)
            }
        }
        createTransaction()
    }
    function handleOpenTransactionLog(){
       setTransactionLogOpen(!transactionLogOpen)
    }
    const header = ["Name", "Deposit", "",""]

    return(
        <div className="w-full">
            {
                profiles &&(
                <div className="w-fill">
                    <div>
                    <div className="flex flex-wrap ">
                        <div className="flex gap-4 p-3 mx-auto">
                            {
                                header.map((h,i) => <p key={i} className="font-bold w-40">{h}</p>)
                            }
                        </div>
                    </div>
                    </div>
                    <div className="flex flex-wrap ">
                    {
                    profiles.map(p=>{
                        return(
                            <div className="flex gap-4 p-3 mx-auto" key={p.profileId}>
                                <p className="truncate w-40">{p.name}</p>
                                <p className="w-40">{profileBalances[p.profileId]}</p>
                                <button className="btn btn-primary"
                                    onClick={()=> handleViewTransactions(p.profileId, group.id)}
                                >
                                    View transactions
                                </button>
                                <button className="btn btn-primary"
                                    onClick={()=> {setOpenTransactionCreate(true); setActiveProfileId(p.profileId)}}
                                >
                                    Create transaction
                                </button>
                                {
                                    openTransactionCreate && activeProfileId === p.profileId && <CreateTransaction setOpen={setOpenTransactionCreate} createTransaction={handleCreateTransaction} profileId={p.profileId} otherMembers={group.members.filter(m => m.profileId !== p.profileId)}/>
                                }
                                {
                                    openTransactionView && activeProfileId === p.profileId && <GroupMemberTransaction setOpen={setOpenTransactionView} createTransaction={handleCreateTransaction} profileId={p.profileId} transactions={transactions}/>
                                }
                            </div>

                        )
                    })}
                    
                    </div>
                    <div className="justify-center flex gap-4 p-3">
                    <button className="btn btn-primary" onClick={handleOpenTransactionLog}>{transactionLogOpen ? "Close" : "View transactions to equaly share"}</button>
                    </div>
                    <div className="justify-center flex gap-4 p-3">
                    {
                        loadingTransactionLog && 
                        (
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        )
                    }
                       { transactionLogOpen && <TransactionLogToEven transactions={transactionLog}/>}
                    
                    </div>
                </div>
                )
            }
             <div className="p-4 h-96">
                <canvas ref={canvasRef} />
            </div>
            
        </div>
    )
}