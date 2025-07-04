import { useEffect, useState } from "react"

export default function AddProfile({setAddGroupVisible, setGroup, group}:
    {
        setAddGroupVisible: (visible: boolean) => void,   
        setGroup: React.Dispatch<React.SetStateAction<Group>>, 
        group: Group,

    }){
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [search, setSearch] = useState<string>('');
    const [newProfile, setNewProfile] = useState<string>('')
    const [creatingProfile, setCreatingProfile] = useState<boolean>(false)
    const [loadingProfiles, setLoadingProfiles] = useState<boolean>(false)
    const [selectedProfiles, setSelectedProfiles] = useState<any[]>(group.members.map(p => {return{id: p.profileId, name: p.name, groupId: 0, groupMembership: []};}))
    const [groupName, setGroupName] = useState<string>(group.name)


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (!target.closest('.create-group-card')) {
            setAddGroupVisible(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [setAddGroupVisible]);
    useEffect(()=>{
        async function getProfiles(){
            setLoadingProfiles(true)
                try{
                    
                  const res = await fetch('http://localhost:5167/api/profile')
                  const data: Profile[] = await res.json();
                  
                  setProfiles(data)
                  console.log("data", data)
                  setLoadingProfiles(false)
                }catch(err){
                  console.error("failed to get profiles: ",err)
                }
              }
        getProfiles()
    }, [])
    function handleCreateProfile(){   
        async function createProfile(){
            try{
                setCreatingProfile(true)
                const res = await fetch('http://localhost:5167/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProfile)
                })
                const data: Profile = await res.json()
                console.log("data", data)
                setProfiles([...profiles, data])
                setNewProfile('')
                setCreatingProfile(false)
            }catch(err){
                console.error("failed to add profile: ",err)
            }
            
             
        }
        createProfile()
    }
    function handleUpdateGroup(){   
        async function updateGroup(){
            console.log("passed profiles", selectedProfiles)

            try{
                const groupData = {
                    "name": groupName,
                    "profileIds": selectedProfiles.map(p => Number(p.id))
                }
                console.log("Asdas", groupData)
                const res = await fetch(`http://localhost:5167/api/groups/${group.id}/update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(groupData)
                })
                const data: Group = await res.json()
                console.log("res", data)
                setGroup(group)
                setAddGroupVisible(false)
            }catch(err){
                console.error("failed to add profile: ",err)
            }
            
             
        }
        updateGroup()
    }
    
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-30">
            <div className="create-group-card bg-red-50 w-72 h-auto p-6 rounded-lg shadow-xl ">
                <input type="text" className="form-control rounded bg-inherit mb-2" placeholder="Enter group name" aria-label="Search" aria-describedby="search-addon" value={groupName}
                        onChange={(e)=> setGroupName(e.target.value)}
                    />
                <div className="mx-3">
                    <div className="input-group border-bottom mb-2">
                        <input 
                            type="search" 
                            className="form-control border-0 rounded-0 p-0 bg-transparent shadow-none" 
                            placeholder="Search" 
                            aria-label="Search" 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="input-group-text bg-transparent border-0">
                            <i className="bi bi-search"></i>
                        </span>
                    </div>
                </div>
                {
                    loadingProfiles ? 
                    (
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ):(
                        <div className="h-64 overflow-y-auto">
                            {
                                profiles.map(p=>{
                                    if(p.name.toLowerCase().includes(search.toLowerCase()))
                                      
                                    return (
                                        <div className="flex w-full items-center justify-between hover:bg-slate-200 cursor-pointer" key={p.profileId}>
                                            <div className="flex-grow p-2"
                                                onClick={() => {
                                                    if (!selectedProfiles.some(selected => selected.id === p.id)) {
                                                        setSelectedProfiles([...selectedProfiles, p]);
                                                    } else {
                                                        setSelectedProfiles(selectedProfiles.filter(profile => profile.id !== p.id));
                                                    }
                                                }}
                                            >
                                                <p key={p.id}>{p.name}</p>
                                            </div>
                                            {selectedProfiles.some(selected => selected.id === p.id) && 
                                                <i className="bi bi-check2 float-right"></i>}
                                        </div>
                                    )
                                })           
                            }
                        </div>
                    )
                }
               
                <div className="flex ">
                <input type="text" className="form-control rounded bg-inherit mb-2" placeholder="Create new profile" aria-label="Search" aria-describedby="search-addon" 
                        onChange={(e)=> setNewProfile(e.target.value)}
                    />
                    {
                        creatingProfile ? 
                        (
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ):(
                            newProfile &&
                            <button className="btn btn-primary h-10"
                                onClick={handleCreateProfile}
                            >Add</button>
                        )
                    }
                    
                    
                </div>
                {
                    groupName && 
                    <button onClick={handleUpdateGroup} className="btn btn-primary">Save changes</button>
                }
            </div>
        </div>
    )
}