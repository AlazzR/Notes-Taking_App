import React from "react";
import { fancyBody } from '../../body_style';
import * as Validation from "../../utility/access";
import "./Sign-up.css";
import axios from "axios";
import CONFIG from "../../dev.config";
import {Link} from "react-router-dom";

type display = "block" | "none";

const SignIn: React.FC = ()=>{
    fancyBody();
    //entries refrences
    const email = React.useRef<HTMLInputElement>(null);
    const password = React.useRef<HTMLInputElement>(null);
    //helper states
    const [emailHelper, setEmail] = React.useState<boolean>(false);
    const [passwordHelper, setPassword] = React.useState<boolean>(false);
    const [submit, setSubmit] = React.useState<boolean>(false);
    const [errorMessages, setErrorMessages] = React.useState<Array<display>>( new Array
        (2).fill("none"));
    
    const changeErrorState: (ind: number, flag: boolean) => void = (ind, flag)=>{
       const tmp = [...errorMessages];
       console.log(flag)
       if(flag)
            tmp[ind] = "none";
       else
            tmp[ind] = "block";
        setErrorMessages(tmp);
        //errorMessages.forEach(item => console.log(item))
    }
    
    const handleInputChanges: (ind: number)=>void =(ind)=>{
        if(ind === 0)
            changeErrorState(0, Validation.checkEmailValidity(email.current!.value));
        
        if(ind === 1)
            changeErrorState(1, Validation.checkPasswordValidity(password.current!.value));

    }

    const handleSubmit: (event: React.FormEvent<HTMLFormElement>)=> void = async (event)=>{
        event.preventDefault();
        //submit information to the backend side.
        //console.log(email.current!.value);
        //console.log(password.current!.value);
        try{
            const res = await axios({
                method: "POST",
                url: CONFIG.backend_asp + "/sign-in",
                data:{
                    password: password.current!.value,
                    email: email.current!.value
                }
            });
            if(res.status === 202){
                localStorage.setItem(CONFIG.tokenName, res.data);
                window.location.href = "/users";
            }
        }catch(err){
            alert(err);
            //window.location.href = "sign-up";
        }
    }

    React.useEffect(()=>{
        if(Validation.checkPasswordValidity(password.current!.value))
            setPassword(true);
        else
            setPassword(false);

        if(Validation.checkEmailValidity(email.current!.value))
            setEmail(true);
        else
            setEmail(false);

        if(passwordHelper && emailHelper)
            setSubmit(true);
        else
            setSubmit(false);
    }, [errorMessages, emailHelper, passwordHelper]);


    return(
        <div >        
            <div id="container-signup">
                <div className="row">
                    Please fill up the following information, if you don't have an account please <Link to="/sign-up">sign-up</Link>:-
                </div>
                <div >
                    <form onSubmit={handleSubmit}>

                    <div className="user-entry">
                            <label htmlFor="email">Email</label>
                            <div>
                                <input type="text" ref={email} placeholder="Enter your email" onChange={() =>handleInputChanges(0)}></input>
                                <p className="error-user-entry" style={{display: errorMessages[0]}}>Please make sure that the email is valid(@gmail.com, @hotmail.com or @windowslive.com).</p>
                            </div>
                        </div>
                        <br/>

                        <div className="user-entry">
                            <label htmlFor="password">Password</label>
                            <div>
                                <input type="password" ref={password} onChange={() =>handleInputChanges(1)} placeholder="Enter your password"></input>
                                <p className="error-user-entry" style={{display: errorMessages[1]}}>Please make sure that the password is of atleast 10 character in length, containes a number and one of the following characters:- @, #, *, or &</p>
                            </div>
                        </div>
                        <br/>
                        <button type="submit" disabled={!submit} style={{marginLeft: "40%", marginTop: "10%"}}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default SignIn;