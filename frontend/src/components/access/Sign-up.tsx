import React from "react";
import { defualtBody, fancyBody } from '../../body_style';
import * as Validation from "../../utility/access";
import "./Sign-up.css";
import axios from "axios";
import CONFIG from "../../dev.config";
import { Link } from "react-router-dom";

type display = "block" | "none";

const SignUp: React.FC = ()=>{
    fancyBody();
    //Entries refrences
    const username = React.useRef<HTMLInputElement>(null);
    const email = React.useRef<HTMLInputElement>(null);
    const password = React.useRef<HTMLInputElement>(null);
    const dob = React.useRef<HTMLInputElement>(null);
    //helper states
    const [usernameHelper, setUsername] = React.useState<boolean>(false);
    const [emailHelper, setEmail] = React.useState<boolean>(false);
    const [passwordHelper, setPassword] = React.useState<boolean>(false);
    const [dobHelper, setDobHelper] = React.useState<boolean>(false);

    const [submit, setSubmit] = React.useState<boolean>(false);
    const [errorMessages, setErrorMessages] = React.useState<Array<display>>( new Array
        (3).fill("none"));
    
    const changeErrorState: (ind: number, flag: boolean) => void = (ind, flag)=>{
       const tmp = [...errorMessages];
       //console.log(flag)
       if(flag)
            tmp[ind] = "none";
       else
            tmp[ind] = "block";
        setErrorMessages(tmp);
        //errorMessages.forEach(item => console.log(item))
    }
    
    const handleInputChanges: (ind: number)=>void =(ind)=>{
        if(ind === 0)
            changeErrorState(0, Validation.checkUsernameValidity(username.current!.value));

        if(ind === 1)
            changeErrorState(1, Validation.checkEmailValidity(email.current!.value));
        
        if(ind === 2)
            changeErrorState(2, Validation.checkPasswordValidity(password.current!.value));

    }
    const handleDoBChange = ()=>{
        if(dob!.current!.value.length > 0)
            setDobHelper(true);
        else
            setDobHelper(false);
    }
    const handleSubmit: (event: React.FormEvent<HTMLFormElement>)=> void = async (event)=>{
        event.preventDefault();
        //submit information to the backend side.
        //console.log(username.current!.value);
        //console.log(email.current!.value);
        //console.log(password.current!.value);
        //console.log(dob.current!.value);
        try{
            const res = await axios({
                method: "POST",
                url: CONFIG.backend_asp + "/sign-up",
                data:{
                    username: username.current!.value,
                    password: password.current!.value,
                    email: email.current!.value,
                    dob: dob.current!.value
    
                }
            });
            if(res.status === 201){
                localStorage.setItem(CONFIG.tokenName, res.data.token);
                window.location.href = "/users";
            }
        }catch(err){
            alert(err);
        }
    }

    React.useEffect(()=>{
        if(Validation.checkUsernameValidity(username.current!.value))
            setUsername(true);
        else
            setUsername(false);

        if(Validation.checkPasswordValidity(password.current!.value))
            setPassword(true);
        else
            setPassword(false);

        if(Validation.checkEmailValidity(email.current!.value))
            setEmail(true);
        else
            setEmail(false);

        if(usernameHelper && passwordHelper && emailHelper && dobHelper)
            setSubmit(true);
        else
            setSubmit(false);
    }, [errorMessages, usernameHelper, emailHelper, passwordHelper, dobHelper]);


    return(
        <div >        
            <div id="container-signup">
                <div className="row">
                    Please fill up the following information, if you already have an account please <Link to="/sign-in">sign-in</Link>:-
                </div>
                <div className="row">
                    <form onSubmit={handleSubmit}>
                        <div className="user-entry">
                            <label>Username</label>
                            <div>
                                <input type="text" ref={username} placeholder="Enter your username" onChange={() =>handleInputChanges(0)}></input>
                                <p className="error-user-entry" style={{display: errorMessages[0]}}>Please make sure that the username is between 8-28 characters and no spaces.</p>
                            </div>
                        </div>
                        <br/>
                        <div className="user-entry">
                            <label htmlFor="email">Email</label>
                            <div>
                                <input type="text" ref={email} placeholder="Enter your email" onChange={() =>handleInputChanges(1)}></input>
                                <p className="error-user-entry" style={{display: errorMessages[1]}}>Please make sure that the email is valid(@gmail.com, @hotmail.com or @windowslive.com).</p>
                            </div>
                        </div>
                        <br/>

                        <div className="user-entry">
                            <label htmlFor="password">Password</label>
                            <div>
                                <input type="password" ref={password} onChange={() =>handleInputChanges(2)} placeholder="Enter your password"></input>
                                <p className="error-user-entry" style={{display: errorMessages[2]}}>Please make sure that the password is of atleast 10 character in length, containes a number and one of the following characters:- @, #, *, or &</p>
                            </div>
                        </div>
                        <br/>

                        <div className="user-entry">
                            <label htmlFor="dob">Date of birth</label>
                            <div>
                                <input type="date" ref={dob} placeholder="Enter your username" min="1990-01-01" max={new Date().toISOString().split("T")[0]} style={{width: "75%"}} onChange={handleDoBChange}></input>
                            </div>
                        </div>

                        <button type="submit" disabled={!submit} style={{marginLeft: "40%", marginTop: "10%"}}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default SignUp;