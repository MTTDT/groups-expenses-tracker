export default function TransactionLogToEven({transactions}:{transactions: Transaction[]}) {
    const header = ["Sender", "Reciever", "Amount"]
    return (
        <div className=" gap-4 p-3 max-w-[50%] overflow-y-auto">
            <div>
                {
                    transactions.length < 1 || transactions[0].money <=0.01  ? <p className="font-bold text-2xl">All costs are shared equaly</p> :
                    <div>
                
                        <div className="flex gap-4 p-3">
                        {  
                            header.map((h, index) => index === 1 ? <p className="font-bold w-40 ml-28" key={h}>{h}</p> :<p className="font-bold w-40" key={h}>{h}</p>)
                        }
                        </div>
                        {
                            
                        transactions.map((t, index) => (
                                <div className="flex gap-4 p-3" key={index}>
                                    <p className="w-40">{t.senderName}</p>
                                    <i className="bi bi-arrow-right pr-20"></i>
                                    <p className="w-40">{t.recipientName}</p>
                                    <p className="w-40">{t.money.toFixed(2)}</p>
                                </div>
                        ))}
                        </div>
                }
          
            </div>
        </div>
    )

}