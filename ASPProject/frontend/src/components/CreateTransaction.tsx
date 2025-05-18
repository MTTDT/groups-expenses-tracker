import { useState, useEffect } from "react"

export default function CreateTransaction(
    {
        setOpen, 
        createTransaction,
        profileId,
        otherMembers
    }:{
        setOpen: (open: boolean) => void, 
        createTransaction: (amount: number, profileId: number, name: string, recipientProfileId?: number) => void, 
        profileId: number,
        otherMembers: Profile[]
    }) {

    const [amount, setAmount] = useState<number>(0)
    const [name, setName] = useState<string>("")
    const [recipientProfileId, setRecipientProfileId] = useState<number>(0)
    

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            
            const target = e.target as HTMLElement;
            if (!target.closest('.create-transaction-card')) {
            setOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpen]);
    
    return (
        <div className="inset-0 fixed bg-black bg-opacity-50 flex items-center justify-center z-50 p-30">
            <div className="create-transaction-card bg-red-50 w-72 h-auto p-6 rounded-lg shadow-xl ">
                <input type="text" className="form-control rounded mb-4" placeholder="Enter transaction name" aria-label="Search" aria-describedby="search-addon"
                    onChange={(e)=> setName(e.target.value)}
                />
                <p className='text-xs'>Please do not select recipient if there is no recipient</p>
                <select className="form-select rounded -mt-4 mb-2" 
                    onChange={(e)=> setRecipientProfileId(Number(e.target.value))}>
                    <option value={0}>Select recipient</option>
                    {
                        otherMembers.map((member, index) => (
                            <option key={index} value={member.profileId}>{member.name}</option>
                        ))
                    }
                    </select>
                <input type="number" className="form-control rounded" placeholder="Enter amount ($)" aria-label="Search" aria-describedby="search-addon" value={(amount===0)?'':amount}
                            onChange={(e)=> setAmount(Number(e.target.value) ? Number(Number(e.target.value).toFixed(2)) : amount)}
                        />
                <button className="btn btn-primary mt-2"
                    onClick={()=> {console.log(amount, profileId, name, recipientProfileId); createTransaction(amount, profileId, name, recipientProfileId)}}
                >
                    Create transaction
                </button>
            </div>
        </div>
    )
}