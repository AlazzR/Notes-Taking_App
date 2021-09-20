import React from "react";
import {Note} from "./Note";
import "./Notes.css";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import CONFIG  from "../../dev.config";
import axios from "axios";
import { useParams } from "react-router-dom";
import noteType from "../../types/noteType";
import NavBar from "../NavBar";

type errorDisplay = "block" | "none";

const getNotes:(username: string, Offset: number, Fetch: number, arr: Array<noteType>)=> Promise<number | null> =  async (username, Offset, Fetch, arr) =>{

    const count = await axios({
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
        },
        url: CONFIG.backend_asp + "/user/notes/fetch-notes",
        data:{
            Offset: Offset,
            Fetch: Fetch,
            Username: username
        }
    }).then(res => {
        res.data.notes.forEach((item: {id: string, title: string, note: string, createdAt: string}) => {
            const val: noteType  = {};
            val[item.id] = { title: item.title, noteValue: item.note, createdAt: item.createdAt};
            arr.push(val);
        });
        return res.data.count;
    }).catch(err => {
        console.log(err);
        return null;
    });
    return count;
}

const Notes: React.FC =  ()=>{
    const { username } = useParams<{username: string}>();
    const [hostUsername, setHostUsername] = React.useState<string>(); 
    //initialize notes from the backend
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [currentNotesCounterState, setCurrentNotesCounterState] = React.useState<number>(0);
    const [notesCountState, setnotesCountState] = React.useState<number>(0);

    const [notes, setNotes] = React.useState<Array<noteType>>([]);

    //posting a new note
    const title = React.useRef<HTMLInputElement>(null);
    const noteValue = React.useRef<HTMLTextAreaElement>(null);
    const [showTitleError, setTitleError] = React.useState<errorDisplay>("none");
    const [showNoteError, setNoteShowError] = React.useState<errorDisplay>("none");
    const [noteValueState, setNoteValueState] = React.useState<string>(""); 
    const [titleValueState, setTitleValueState] = React.useState<string>(""); 


    const loadingInitialNotes = async ()=>{
        console.log(isLoading);
        if(isLoading)
        {   
            const val = await getNotes(username, currentNotesCounterState, 5, notes);
            const host = await await axios({
                method: "GET",
                url: CONFIG.backend_asp + `/username`,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                }
            });
            console.log(val)
            if(val === null || host === null)
                alert("Wrong user");
            else{
                setIsLoading(!(val >= 0));
                setNotes([...notes]);
                setnotesCountState(val!);
                setCurrentNotesCounterState(notes.length);
                setHostUsername(host.data.username);
            }
        }
    } 

    const getNotesAsync = async ()=>{
        const fetch: number = notesCountState - currentNotesCounterState > 0? 1 : -1;
        if(fetch === -1)
            return;
        // console.log(notesCountState - counterState)
        //const t = notesCountState - currentNotesCounterState >= 5? 5: notesCountState - currentNotesCounterState;
        // console.log("fetch " + t);
        const val = await getNotes(username, currentNotesCounterState, notesCountState - currentNotesCounterState >= 5? 5: notesCountState - currentNotesCounterState, notes);
        console.log(val)
        if(val === null)
            alert("Wrong user");
        else{
            setNotes([...notes]);
            setnotesCountState(val!);
            setCurrentNotesCounterState(notes.length);
        }
    } 

    const handleTitleChange = ()=>{
        setTitleValueState(title!.current!.value);
        if( titleValueState.length >= 5)
            setTitleError("none");
        else
            setTitleError("block");
    };

    const handleNoteChange = ()=>{
        setNoteValueState(noteValue!.current!.value);
        if(noteValue!.current!.value.length >= 40)
            setNoteShowError("none");
        else
            setNoteShowError("block");
    };

    const handleSubmit: (event: React.FormEvent<HTMLFormElement>)=> void = async (event)=>{
        event.preventDefault();
        const tmpNotes: Array<noteType> = [...notes];//id: [title, note, createdAt]
        try{
            const res = await axios({
                method: "POST",
                url: CONFIG.backend_asp + "/user/notes",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                },
                data:{
                    Title: title!.current!.value,
                    Note: noteValue!.current!.value
                }
            });
            if(res.status === 200){
                const note: noteType = {};
                note[res.data.id] ={
                    createdAt: res.data.createdAt,
                    noteValue: noteValue!.current!.value,
                    title: title!.current!.value
                };

                tmpNotes.push(note);
                setNotes([...tmpNotes]);
                noteValue!.current!.value = "";
                title!.current!.value = "";
                setTitleValueState("");
                setNoteValueState("");

                setnotesCountState(notesCountState! + 1);
                setCurrentNotesCounterState(currentNotesCounterState + 1);
            }
        }catch(err){
            console.log(err);
        }
    }
    let newConnection: HubConnection | null = null;
    const HandleConnection = async ()=>{
            newConnection = new HubConnectionBuilder()
                .withUrl(CONFIG.backend_asp + "/user/notes/comments")
                .withAutomaticReconnect()
                .build();
            console.log(newConnection)
            if(newConnection !== null){
                newConnection.start()
                    .then(res =>{
                        newConnection!.on("ReceiveMessage", msg => {
                            console.log("msg received" + msg)
                        })
                    })
                    .catch(err => console.log("unable to connect due " + err));
            }

    }
    const HandleSend = async()=>{
        console.log(newConnection)
        // axios({
        //     method: "POST",
        //     url: CONFIG.backend_asp + "/testing",
        //     data:{
        //         NoteId: "1",
        //         NoteOwner: "3",
        //         CommentId: "2",
        //         CommentValue: "123dojfdijfdf",
        //         CreatedAt: new Date()}}).then(res => console.log(res)).catch(err => console.log(err));
        if(newConnection !== null){
            try{
                await newConnection.send("SendUpdatedComments", {
                    NoteId: "DFA3AEC9-B069-4D1A-95A9-8823916275C0",
                    NoteOwner: "3",
                    CommentId: "2",
                    CommentValue: "123dojfdijfdf",
                    CommentOwner: "222",
                    CreatedAt: new Date()
                    
                });

            }catch(err){
                console.log(err);
            }
        }
    }

    const handleNoteEdit = async (ind: number, title: string, noteValue: string, noteId: string)=>{
        const note: noteType = notes[ind];
        console.log(note);
        try{
            const res = await axios({
                method: "PATCH",
                url: CONFIG.backend_asp + "/user/notes",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                },
                data: {
                    Id: noteId,
                    Title: title,
                    Note: noteValue
                }
            });
            if(res.status === 200){
                note[Object.keys(note)[0]].title = title;
                note[Object.keys(note)[0]].noteValue = noteValue;
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleNoteDeletion =  async (ind: number, title: string, noteValue: string, noteId: string)=>{
        try{
            const deleted =  await axios({
                method: "DELETE",
                url: CONFIG.backend_asp + "/user/notes",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                },
                data:{
                    Id: noteId,
                    Title: title,
                    Note: noteValue
                }
            });
            if(deleted.data)
            {
                console.log("Delete note " + noteId);
                const tmp = notes.filter((item, i) => noteId !== Object.keys(item)[0] );
                console.log(tmp)
                setNotes([]);
                setNotes([...tmp]);
                setnotesCountState(notesCountState! - 1);
                setCurrentNotesCounterState(currentNotesCounterState - 1);
            }
        }catch(err){
            console.log(err);
        }
    }

    React.useEffect(()=>{
        loadingInitialNotes();
    }, [isLoading]);

    if(isLoading){
        return(
            <div>Loading!</div>
        )
    }

    return(
        <div>
            <NavBar />
            <button onClick={HandleConnection}>Get SignalR</button>
            <button onClick={HandleSend}>Send SignalR</button>

            {hostUsername === username?<div id="new-note">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="new-note-title">Title</label>
                    <br/>
                    <input type="text" placeholder="Please enter the title of this note" ref={title} onChange={handleTitleChange} style={{overflow: "scroll", resize:"none", width: "100%"}}></input>
                    <p className="error-new-note" style={{display: showTitleError}}>Please enter a title of at least 5 characters in length.</p>
                    <br/>
                    <label htmlFor="new-note-title">Note</label>
                    <textarea placeholder="Please enter your note:-" ref={noteValue} onChange={handleNoteChange} style={{overflow: "scroll", resize:"vertical", width: "100%", height: "100px"}}></textarea>
                    <p className="counter-char">Current # character is {noteValueState.length}</p>
                    <p className="error-new-note"  style={{display: showNoteError}}>Please enter a note of at least 40 characters.</p>
                    <button disabled={noteValueState.length < 40 || titleValueState.length < 5} style={{marginLeft: "40%"}}>Submit</button>
                </form>
            </div>:<div></div>}

            <ul>
                {notes.map((item, ind)=> <Note key={ind} note={item} id={ind} username={username} onEdit={handleNoteEdit} onDelete={handleNoteDeletion}/>)}
            </ul>
            <button id="show-more" disabled={currentNotesCounterState >= notesCountState? true: false } onClick={getNotesAsync}>Show More {`${currentNotesCounterState} / ${notesCountState}`}</button>
        </div>
    );
}


export{
    Notes,
    getNotes
}