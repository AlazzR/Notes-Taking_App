import axios from "axios";
import React from "react";
import NavBar from "../NavBar";
import CONFIG from "../../dev.config";
import User from "./User";

type usersType = Array<{username: string}>;

const getUsers: (offset: number, numToFetch: number)=>Promise<{connected: usersType, notConnected: usersType, countNotConnected: number, countConnected: number}| null | undefined> = async(offset, numToFetch)=>{
    try{
        const res = await axios({
            method: "GET",
            url: CONFIG.backend_asp + `/users?offset=${offset}&fetch=${numToFetch}`,
            headers:{
                "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
            }
        });
        if(res.status === 200)
        {
            const connected: usersType = [];
            res.data!.connected.forEach((item: {username: string}) =>{
                connected.push({username: item.username});
            });
            const notConnected: usersType = [];
            res.data!.notConnected.forEach((item: {username: string}) =>{
                notConnected.push({username: item.username});
            });
            return {
                connected, notConnected, countConnected: res.data.countConnected, countNotConnected: res.data.countNotConnected
            };
        }
    }catch(err){
        console.log(err);
        return null;
    }

}
const Users: React.FC = ()=>{
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const [connectedUsers, setConnectedUsers] = React.useState<usersType>([]);
    const [notConnectedUsers, setNotConnectedUsers] = React.useState<usersType>([]);
    const [usersCounter, setUsersCounter] = React.useState<number>(0);
    const [currentFetchUserCounter, setcurrentFetchUserCounterCounter] = React.useState<number>(0);


    const loadUsers = async()=>{
        if(isLoading){
            const result = await getUsers(0, 5);
            if(result === undefined || result === null)
                return;
            setConnectedUsers([...result.connected]);
            setNotConnectedUsers([...result.notConnected]);
            setUsersCounter(result.countConnected);
            setIsLoading(false);
            setcurrentFetchUserCounterCounter(result.countNotConnected);
        }
    }

    const handleGetUsersNotConnected = async ()=>{
        const result = await getUsers(currentFetchUserCounter, 5);
        if(result === undefined || result === null)
            return;
        setConnectedUsers([...result.connected]);
        setNotConnectedUsers([...notConnectedUsers, ...result.notConnected]);
        setUsersCounter(result.countConnected);
        setcurrentFetchUserCounterCounter(currentFetchUserCounter + result.countNotConnected);
        setIsLoading(false);
    }
    
    React.useEffect(()=>{
        if(isLoading)
            loadUsers();
    }, [isLoading]);

    if(isLoading)
        return(<div>Loading ...</div>)
    console.log(currentFetchUserCounter)
    return(
        <div>
            <NavBar />
            
            <div style={{marginLeft: "10%", marginRight: "10%"}}>
                Users that you interacted with:-
                <ul style={{border: "1px solid black", padding: "10px"}}>
                    {connectedUsers.map((item, ind) => <User key={ind} username={item.username}/>)}
                </ul>
            </div>

            <div style={{marginLeft: "10%", marginRight: "10%"}}>
                Users that you didn't interact with:-
                <ul style={{border: "1px solid black", padding: "10px"}}>
                {notConnectedUsers.map((item, ind) => <User key={ind} username={item.username}/>)}

                </ul>
            </div>

            <button disabled={currentFetchUserCounter >= usersCounter} onClick={handleGetUsersNotConnected}
            style={{marginLeft: "40%"}}>Show more {currentFetchUserCounter}/{usersCounter}</button>
        </div>
    );
}

export default Users;