import { useState, useEffect } from "react"

export default function GroupMemberTransaction({setOpen, createTransaction, profileId, transactions}:{setOpen: (open: boolean) => void, createTransaction: (amount: number, profileId: number, name: string) => void, profileId: number, transactions: Transaction[]}) {

    const [amount, setAmount] = useState<number>(0)
    const [name, setName] = useState<string>("")
    

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.view-transaction-card')) {
            setOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpen]);
    console.log("transactions", transactions)
    const header = ["Message", "Deposit", "Sender","Reciever"]
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-30">
            <div className="create-group-card bg-red-50 w-auto h-auto max-h-[70%] p-6 rounded-lg shadow-xl overflow-y-auto">
                {transactions.length > 0 ? (
                    <>
                        <div className="flex gap-4 p-3">
                            {
                                header.map(h => <p className="font-bold w-40" key={h}>{h}</p>)
                            }
                        </div>
                        {transactions.map((t, index) => (
                                <div className="flex gap-4 p-3" key={index}>
                                    <p className="w-40">{t.name}</p>
                                    <p className="w-40">{t.money}</p>
                                    <p className="w-40">{t.senderName}</p>
                                    <p className="w-40">{t.recipientName}</p>

                                </div>
                        ))}
                    </>

                     
                    ):(
                        <p>No transactions found</p>
                        
                    )}
            </div>
        </div>
    )
}