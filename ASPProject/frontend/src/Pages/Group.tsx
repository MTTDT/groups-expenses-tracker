import AddProfile from "../components/AddProfile";
import ProfileList from "../components/ProfilesList";
import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"


export default function Group(){
    const { id  } = useParams();
    const navigate = useNavigate()

    const [loadingGroup, setLoadingGroup] = useState(true);
    const [reloadBalance, setReloadBalance] = useState(false)
    const [group, setGroup] = useState<Group>()

    const [deletingGroup, setDeletingGroup] = useState(false)
    const [groupBalance, setGroupBalance] = useState<number>(0)
    const [addGroupVisible,setAddGroupVisible] = useState<boolean>(false)


       
    useEffect(()=>{
        async function getGroup(){
            setLoadingGroup(true)
            
            try{
                
                const res = await fetch(`http://localhost:5167/api/groups/${id}`)
                const data: Group = await res.json();
                console.log("dataa", data)
                setGroup(data)
                setLoadingGroup(false)
            }catch(err){
                console.error("failed to get group: ",err)
            }
        }
       
        getGroup()
    },[id, addGroupVisible])  
    useEffect(()=>{
        setReloadBalance(false)
        async function getGroupBalance(){
            try{
                const res = await fetch(`http://localhost:5167/api/groups/${id}/balance`)
                const data: number = await res.json()
                console.log("balance", data)
                setGroupBalance(data)
            }catch(err){
                console.error("failed to get group balance: ",err)
            }
        }
        getGroupBalance()
    },[reloadBalance])

    function handleDeleteGroup(){
        async function deleteGroup(){
            try{
                setDeletingGroup(true)
                const res = await fetch(`http://localhost:5167/api/groups/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                if(res.ok){
                    console.log("Group deleted")
                    setDeletingGroup(false)
                    navigate('/')
                }else{
                    console.error("Failed to delete group")
                    setDeletingGroup(false)
                }
            }catch(err){
                console.error("failed to delete group: ",err)
                setDeletingGroup(false)
            }
        }
        deleteGroup()
    }


    return(
        <div className="w-full min-h-screen bg-red-50 ">
            <div className="flex gap-4  w-full pl-6 py-4 bg-red-300">
                <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
                <h1 className="text-2xl font-bold">{group?.name}</h1>

            </div>
            <div className="h-full p-3">      
            {   
                group && group?.members.length > 0 ?
                    <div>

                        <ProfileList group={group} setReloadBalance={setReloadBalance}/>
                        <p className="text-2xl">Bendra suma <span className="font-bold text-4xl px-2">{groupBalance}</span>, kiekvienas turi sumoketi po <span className="font-bold text-4xl px-2">{group?.members && (groupBalance / group?.members.length).toFixed(2)}</span></p>

                    </div>
                    :
                    <div className="justify-center flex flex-col items-center">
                        <p className="text-2xl font-bold">No members in group</p>
                    </div>
            }
            
        
            <div className="space-y-2 justify-center flex flex-col items-center">
                <div><button onClick={()=>{setAddGroupVisible(true)}} className="btn btn-primary">Edit group</button></div>
                {deletingGroup ? <p>deleting...</p> : <button className="btn btn-danger" onClick={handleDeleteGroup}>Delete Group</button>}
            </div>
        </div>
        {addGroupVisible && group && <AddProfile  setAddGroupVisible={setAddGroupVisible} group={group} setGroup={setGroup as React.Dispatch<React.SetStateAction<Group>>}/>}

       </div>
    )
}