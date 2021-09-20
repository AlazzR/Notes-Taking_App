import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./Note.css";
import {Comments} from "./Comments";
import CONFIG from "../../dev.config";
import axios from "axios";
import NavBar from "../NavBar";

type resizeType = "vertical" | "none";


const NoteLink: React.FC = () =>{
    const { username } = useParams<{username: string}>();
    const noteId = useLocation().search.split("?id=")[1];
    //console.log(username)
    //console.log(noteId)

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const [editFlag, setEditFlag] = React.useState<boolean>(false);
    const [resize, setResize] = React.useState<resizeType>("none");
    const [submit, setSubmit] = React.useState<boolean>(true);
    const title = React.useRef<HTMLParagraphElement>(null);
    const noteValue = React.useRef<HTMLParagraphElement>(null);
    const submitShow: ["block", "none"] = ["block", "none"];
    const [titleState, setTitleState] = React.useState<string>();
    const [noteState, setNoteState] = React.useState<string>();
    const [createdAtState, setCreatedAtState] = React.useState<string>();

    const [showComments, setShowComments] = React.useState<boolean>(false);
    
    const loadNoteAndComment = async()=>{
        await axios({
            method: "GET",
            url: CONFIG.backend_asp + `/user/notes/fetch-notes?NoteId=${noteId}`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
            }
        }).then(res =>{
            setIsLoading(false);
            setTitleState(res.data.note.title);
            setNoteState(res.data.note.note);
            setCreatedAtState(res.data.note.createdAt);


        }).catch(err =>{
            console.log(err);
        })
    }

    React.useEffect(()=>{
        loadNoteAndComment();

    }, [isLoading])
    
    const handleShowComments = ()=>{
        setShowComments(!showComments);
    }

    const handleEdit: () => void = ()=>{
        // console.log(title!.current!.innerHTML);
        // console.log(noteValue!.current!.innerHTML);
        if(title!.current!.innerHTML!.length >= 5 && noteValue!.current!.innerHTML!.length >= 40)
            setSubmit(false);
        else 
            setSubmit(true);

        setEditFlag(!editFlag);
        if(!editFlag)
            setResize("vertical");
        else
            setResize("none");
    }
    const handleSubmit: ()=>void = async ()=>{
        setTitleState(title!.current!.innerHTML);
        setNoteState(noteValue!.current!.innerHTML);
        axios({
            method: "PATCH",
            url: CONFIG.backend_asp + "/user/notes",
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`
            },
            data: {
                Id: noteId,
                Title: title!.current!.innerHTML,
                Note: noteValue!.current!.innerHTML
            }
        });

        setSubmit(true);
        setEditFlag(false);
        setResize("none");

    }
    if(isLoading)
        return(
            <div>
                Is Loading..
            </div>
        )
    return(
        <div>
            <NavBar />
            <div className="note-struct">
                <Link to={`/user/notes/${username}`}>Go back to {username}-notes</Link>
                <h3>Title</h3>
                <p contentEditable={editFlag} style={{resize: resize, overflow: "scroll", border: "1px solid", borderColor: resize === "none"? "white": "black"}} ref={title}>{titleState}</p>
                <h3>Note</h3>
                <p contentEditable={editFlag} style={{resize: resize, overflow: "scroll", height: "100px", border: "1px solid", borderColor: resize === "none"? "white": "black"}} ref={noteValue}>{noteState}</p>
                <p style={{fontSize: "8px", marginLeft: "80%", display: "block"}}>Created at:- {createdAtState}</p>
                <button className="note-hooks" onClick={handleEdit}>Edit</button>
                <button className="note-hooks" onClick={handleSubmit} disabled={submit} style={{display: submitShow[+!editFlag]}}>Submit</button>
                <button className="note-hooks" style={{marginLeft: "90%", fontSize: "8px"}} onClick={handleShowComments}>Show Comments</button>
            </div>
            {+!showComments?<div></div>:<Comments noteId={noteId} noteOwner={username} />}
                
        </div>

    )


};


export{
    NoteLink,
}