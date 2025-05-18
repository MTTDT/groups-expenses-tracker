import { useState } from "react"
import CreateGroupCard from "./CreateGroupCard";

export default function AddGroupCard({setGroups, groups}:{  setGroups: React.Dispatch<React.SetStateAction<Group[]>>, groups: Group[]}){
    const[addGroupVisible, setAddGroupVisible] = useState<boolean>(false);
    function handleAddGroup(){
        setAddGroupVisible(true)
    }
    return(
        <div>
            <div className="h-44 w-32 sm:w-64 bg-gray-300 hover:bg-gray-400 cursor-pointer flex justify-center items-center rounded-lg transition-colors duration-200"
                onClick={handleAddGroup}
            >
                <i className="bi bi-plus-circle text-4xl text-gray-600 hover:text-gray-800"></i>
            </div>
            {
                addGroupVisible && 
                <div>
                    <CreateGroupCard setAddGroupVisible={setAddGroupVisible} setGroups={setGroups} groups={groups}/>
                </div>
            }
        </div>
      
    )
}