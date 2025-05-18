import { Link } from 'react-router-dom';
import AddGroupCard from '../components/AddGroupCard';
import GroupCard from '../components/GroupCard'
import { useState, useEffect } from 'react';

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([])
  useEffect(()=>{
      async function getGroups(){
        try{
          const res = await fetch('http://localhost:5167/api/groups');
          const data: Group[] = await res.json()
          console.log("data", data)
          setGroups(data)
        }catch(err){
          console.error("Failed to fetch groups: ", err)
        }
      }
      getGroups()
      
  },[])
  
  return (
    <div className="w-full min-h-screen bg-red-50">
      <div className=' font-bold w-full px-6 py-3 bg-red-300 flex justify-between mb-4'>
        <h1 className="text-2xl">Groups</h1>
        <i className="text-2xl bi bi-person-circle my-auto"></i>
      </div>
      
      <div className='flex flex-wrap gap-4 justify-center '>
        {
          groups.map(g => <div className='px-2' key={g.id}><GroupCard group={g}/></div>)
        }
        <div className='px-2'><AddGroupCard setGroups={setGroups} groups={groups}/></div>
        
      </div>
     
    </div>
  );
}