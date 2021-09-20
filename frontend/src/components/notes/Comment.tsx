import React from "react";
import { Link } from "react-router-dom";
import "./Comment.css";
import type {commentType} from "./Comments";

const Comment: React.FC<{id: number, commentOwner:string, noteOwner: string, noteId: string, commentId: string, commentValue: string | null , createdAt: string | null, allowDelete: boolean, onDelete: (ind: number, comment: commentType)=>void}> =({id, noteId, commentId, commentValue, createdAt, allowDelete, onDelete, noteOwner, commentOwner})=>{

    const handleDelete = ()=>{
        const c: commentType = {
            Id: commentId,
            NoteId: noteId,
            NoteOwner: noteOwner,
            CommentOwner: commentOwner,
            CommentValue: null,
            CreatedAt: null
        }
        onDelete(id, c);
    }

    return(
        <div style={{margin: "5%", border: "1px solid black", padding: "5%"}}>
            {allowDelete?<button className="delete-comment" onClick={handleDelete}>X</button>:<></>}
            {commentId}
            <div className="comment">
                <p>{commentOwner}</p>
                <p>{commentValue}</p>
                <p className="date">{createdAt}</p>
            </div>

        </div>
    );

}

export default Comment;