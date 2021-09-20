import React from "react";
import CONFIG from "../dev.config";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NavBar.css";

type logout = "none" | "block"
const NavBar: React.FC = ()=>{

    const [username, setUsername] = React.useState<string>();
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [displayLogout, setDisplayLogout] = React.useState<logout>("none");

    const getUsername = async()=>{
        try{
            const res =  await axios({
                method: "GET",
                url: CONFIG.backend_asp + `/username`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                }
            })
            if(res.status === 200){
                setUsername(res.data.username);
                setIsLoaded(true);
            }
        }catch(err){
            console.log(err);
        }
    }
    
    const handleShowLogout = ()=>{
        if(displayLogout === "none")
            setDisplayLogout("block");
        else
            setDisplayLogout("none");
    }
    const handleLogout = ()=>{
        if(localStorage.getItem(CONFIG.tokenName) !== null){
            axios({
                method: "DELETE",
                url: CONFIG.backend_asp + "/logout",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                }
            });
            window.location.href = "/";
            localStorage.removeItem(CONFIG.tokenName);
        }
    }

    React.useEffect(()=>{
        if(!isLoaded){
            getUsername();
        }
    }, [isLoaded]);
    return(
        <nav>
            {isLoaded?
            <div className="navbar-bar">
                <div>
                    <Link to={`/users/`}>{username!.toUpperCase()}</Link>
                </div>
                <div>
                    <button onClick={handleShowLogout} style={{width: "70px"}}>Account</button>
                    <ul>
                        <button style={{display: displayLogout, marginLeft: "-40px", width: "70px", marginTop: "-15px", marginBottom: "0px"}} onClick={handleLogout}>Logout</button>
                        <button onClick={() =>{window.location.href  = `/users/${username}/notes`;}} style={{display: displayLogout, marginLeft: "-40px", width: "70px", marginBottom: "0px"}}>Notes</button>
                    </ul>
                </div>

            </div>:
            <div></div>}
        </nav>
    );
}


export default NavBar;