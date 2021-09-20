import React from "react";
import { Link } from "react-router-dom";
import "./Note.css";
import {Comments} from "./Comments";
import noteType from "../../types/noteType";


type resizeType = "vertical" | "none";
type noteHandlers = (ind: number, title: string, noteValue: string, noteId: string) => void;

const Note: React.FC<{note: noteType, id : number, username: string, onEdit: noteHandlers, onDelete: noteHandlers}> = ({note, id, username, onEdit, onDelete})=>{
    
    const [editFlag, setEditFlag] = React.useState<boolean>(false);
    const [resize, setResize] = React.useState<resizeType>("none");
    const [submit, setSubmit] = React.useState<boolean>(true);
    
    const title = React.useRef<HTMLParagraphElement>(null);
    const noteValue = React.useRef<HTMLParagraphElement>(null);
    const submitShow: ["block", "none"] = ["block", "none"];

    const [titleState, setTitleState] = React.useState<string>(note[Object.keys(note)[0]].title);
    const [noteState, setNoteState] = React.useState<string>(note[Object.keys(note)[0]].noteValue);

    const [showComments, setShowComments] = React.useState<boolean>(false);

    const handleShowComments = ()=>{
        setShowComments(!showComments);
    }

    const handleEdit: () => void = ()=>{
        console.log(title!.current!.innerHTML.length);
        console.log(noteValue!.current!.innerHTML);
        if(title!.current!.innerHTML.length >= 5 && noteValue!.current!.innerHTML.length >= 40)
            setSubmit(false);
        else 
            setSubmit(true);

        setEditFlag(!editFlag);
        if(!editFlag)
            setResize("vertical");
        else
            setResize("none");
    }
    const handleDelete: ()=>void = ()=>{
        onDelete(id, titleState, noteState, Object.keys(note)[0]);
    }

    const handleSubmit: ()=>void = ()=>{
        setTitleState(title!.current!.innerHTML);
        setNoteState(noteValue!.current!.innerHTML);
        onEdit(id, titleState, noteState, Object.keys(note)[0]);
        setSubmit(true);
        setEditFlag(false);
        setResize("none");

    }

    return(
        <div>
            <div className="note-struct">
                <Link to={`/users/${username}/notes/note?id=${Object.keys(note)[0]}`}>{Object.keys(note)[0]}</Link>
                <button className="delete-note" onClick={handleDelete}>X</button>
                <h3>Title</h3>
                <p contentEditable={editFlag} style={{resize: resize, overflow: "scroll", border: "1px solid", borderColor: resize === "none"? "white": "black"}} ref={title}>{titleState}</p>
                <h3>Note</h3>
                <p contentEditable={editFlag} style={{resize: resize, overflow: "scroll", height: "100px", border: "1px solid", borderColor: resize === "none"? "white": "black"}} ref={noteValue}>{noteState}</p>
                <p style={{fontSize: "8px", marginLeft: "80%", display: "block"}}>Created at:- {note[Object.keys(note)[0]].createdAt}</p>
                <button className="note-hooks" onClick={handleEdit}>Edit</button>
                <button className="note-hooks" onClick={handleSubmit} disabled={submit} style={{display: submitShow[+!editFlag]}}>Submit</button>
                <button className="note-hooks" style={{marginLeft: "90%", fontSize: "8px"}} onClick={handleShowComments}>Show Comments</button>
            </div>
            {+!showComments?<div></div>:<Comments noteId={Object.keys(note)[0]} noteOwner={username} />}
        </div>

    )


};


export{
    Note,
}