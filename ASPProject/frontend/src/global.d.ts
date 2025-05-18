interface Profile{
    id:number,
    profileId: number,
    name:string,
    balance: number

}
interface Group{
    id: number,
    name: string,
    members: Profile[],
    balance: number
}
interface Transaction{
    money: number,
    name: string,
    recipientName?: string,
    senderName: string,
}