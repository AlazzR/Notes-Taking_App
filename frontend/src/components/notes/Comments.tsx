import React, { FormEvent } from "react";
import Comment from "./Comment";
import "./Comments.css";
import CONFIG from "../../dev.config";
import axios from "axios";


type commentType = {
    Id: string,
    NoteId: string,
    NoteOwner: string,
    CommentOwner: string,
    CommentValue: string | null,
    CreatedAt: string | null
};

const Comments: React.FC<{noteId: string, noteOwner: string}> = ({noteId, noteOwner})=>{
    
    const [comments, setComments] = React.useState<Array<commentType>>([]);

    const [commentOwner, setCommentOwner] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const commentValue = React.useRef<HTMLTextAreaElement>(null);
    const [commentNumChar, setCommentNumChar] = React.useState<number>(0);
    const [submitAllow, setSubmitAllow] = React.useState<boolean>(false);

    const loadingComments = async ()=>{
        console.log(CONFIG.backend_asp + `/user/notes/comments?NoteOwner=${noteOwner}&NoteId=${noteId}`)
        await axios({
            method: "GET",
            url: CONFIG.backend_asp + `/user/notes/comments?NoteOwner=${noteOwner}&NoteId=${noteId}`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
            }
        }).then(res =>{
            if(isLoading)
                setIsLoading(false);
            // console.log(res.data.comments);
            const arrComments: Array<commentType> = []
            res.data.comments.forEach((item: {id: string, noteId: string, noteOwner: string, commentOwner: string, commentValue: string, createdAt: string}) =>{
                console.log(item.commentOwner, " ", item.noteOwner);
                const val: commentType = {
                    Id: item.id, NoteId: item.noteId, NoteOwner: item.noteOwner, CommentOwner: item.commentOwner, CommentValue: item.commentValue, CreatedAt: item.createdAt
                };
                arrComments.push(val);
            });
            setComments(arrComments);
        }).catch(err => console.log(err));

        await axios({
            method: "GET",
            url: CONFIG.backend_asp + `/username`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
            }
        }).then(res =>{
            console.log("res" + res.data.username);
            setCommentOwner(res.data.username);
            console.log("comment owner" + commentOwner);
            console.log(noteOwner);

        }).catch(err => console.log(err));
        
    }

    React.useEffect(()=>{
        console.log("comment")
        if(isLoading)
            loadingComments();

    }, [isLoading, comments]);

    const handleCommentChange = ()=>{
        setCommentNumChar(commentValue!.current!.value.length);
        // console.log(commentValue!.current!.value.length);
        console.log(commentValue!.current!.value);

        if(commentNumChar > 1 && commentNumChar < 150)
            setSubmitAllow(true);
        else
            setSubmitAllow(false);
    }

    const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = async (event)=>{
        event.preventDefault();
        console.log(commentValue!.current!.innerHTML);
        try{
            console.log()
            const comment = await axios({
                method: "POST",
                url: CONFIG.backend_asp + "/user/notes/comments",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                },
                data:{
                    NoteId: noteId,
                    NoteOwner: noteOwner,
                    CommentValue:  commentValue!.current!.value
                }
            });

            const tmp = [...comments];
            const val: commentType = {
                Id: comment!.data!.comment.id,
                NoteId: comment!.data!.comment.noteId,
                CommentOwner: comment!.data!.comment.commentOwner,
                NoteOwner: comment!.data!.comment.noteOwner,
                CommentValue: comment!.data!.comment.commentValue,
                CreatedAt: comment!.data!.comment.createdAt
            };
            tmp.push(val);
            setComments([]);
            setComments([...tmp]);
            commentValue!.current!.value = "";
            setCommentNumChar(commentValue!.current!.value.length);

        }catch(err){
            console.log(err);
        }
        //setComments([...comments, {"1222-112": [commentValue!.current!.value, (new Date()).toString()]}]);
    }

    const handleDelete: (ind: number, comment: commentType)=>void = async (ind, comment)=>{
        try{
            const res = await axios({
                method: "DELETE", 
                url: CONFIG.backend_asp + "/user/notes/comments",
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem(CONFIG.tokenName)}`
                },
                data: {
                    Id: comment.Id,
                    NoteId: comment.NoteId,
                    CommentOwner: comment.CommentOwner,
                    noteOwner: commentOwner
                }
            });
            if(res.status == 200){
                let tmp = [...comments];
                tmp = tmp.filter((item, i) => i !== ind);
                setComments([]);
                setComments([...tmp]);
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="comment-container" style={{overflow: "scroll"}}>
            <div>
                <ul>
                    {comments.map((item, ind) => 
                        <Comment 
                            key={ind} 
                            id={ind}
                            noteId={noteId}
                            commentId={item.Id}
                            commentValue={item.CommentValue}
                            commentOwner={item.CommentOwner}
                            noteOwner={noteOwner}
                            createdAt={item.CreatedAt}
                            allowDelete={noteOwner === commentOwner}
                            onDelete={handleDelete}
                        />)}
                </ul>
            </div>

            <div className="new-comment">
                <form onSubmit={handleSubmit}>
                    <h3>Add a new Comment</h3>
                    <textarea onChange={handleCommentChange} ref={commentValue} placeholder="Please add a comment"></textarea>
                    <p style={{marginLeft: "90%", fontSize: "10px"}}>{commentNumChar}/150</p>
                    <button disabled={!submitAllow}>Post</button>
                </form>
            </div>

        </div>

    );
}

export {
    Comments,
    
};
export type{
    commentType
}