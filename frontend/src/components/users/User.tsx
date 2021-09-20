import React from "react";
import { Link } from "react-router-dom";

const User: React.FC<{username: string}> = ({username})=>{

    return(
        <div style={{padding: "10px", border: "1px solid black", marginBottom: "10px"}}>
            <Link to={`/users/${username}/notes/`}>{username}</Link>
        </div>
    )
}

export default User;