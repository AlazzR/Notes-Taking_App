import React from "react";
import { defualtBody } from '../../body_style';
import * as Validation from "../../utility/access";

type display = "block" | "none";

const SignUp: React.FC = ()=>{
    defualtBody();
    //username, email, password, dob.
    const username = React.useRef<HTMLInputElement>(null);
    const email = React.useRef<HTMLInputElement>(null);
    const password = React.useRef<HTMLInputElement>(null);
    const dob = React.useRef<HTMLInputElement>(null);

    const [usernameHelper, setUsername] = React.useState<boolean>(false);
    const [emailHelper, setEmail] = React.useState<boolean>(false);
    const [passwordHelper, setPassword] = React.useState<boolean>(false);
    const [submit, setSubmit] = React.useState<boolean>(false);
    const [errorMessages, setErrorMessages] = React.useState<Array<display>>( new Array
        (3).fill("none"));
    
    const ChangeErrorState: (ind: number, flag: boolean) => void = (ind, flag)=>{
       const tmp = [...errorMessages];
       console.log(flag)
       if(flag)
            tmp[ind] = "none";
       else
            tmp[ind] = "block";
        setErrorMessages(tmp);
        //errorMessages.forEach(item => console.log(item))
    }
    
    const HandleInputChanges: (ind: number)=>void =(ind)=>{
        if(ind === 0)
            ChangeErrorState(0, Validation.CheckUsernameValidity(username.current!.value));

        if(ind === 1)
            ChangeErrorState(1, Validation.CheckEmailValidity(email.current!.value));
        
        if(ind === 2)
            ChangeErrorState(2, Validation.CheckPasswordValidity(password.current!.value));

    }

    const handleSubmit: (event: React.FormEvent<HTMLFormElement>)=> void = (event)=>{
        event.preventDefault();
        //submit information to the backend side.
        console.log(username.current!.value);
        console.log(email.current!.value);
        console.log(password.current!.value);
        console.log(dob.current!.value);
    }

    React.useEffect(()=>{
        console.log("************")
        if(Validation.CheckUsernameValidity(username.current!.value))
            setUsername(true);
        else
            setUsername(false);

        if(Validation.CheckPasswordValidity(password.current!.value))
            setPassword(true);
        else
            setPassword(false);

        if(Validation.CheckEmailValidity(email.current!.value))
            setEmail(true);
        else
            setEmail(false);

        if(usernameHelper && passwordHelper && emailHelper && dob.current!.value !== null)
            setSubmit(true);
        else
            setSubmit(false);
    }, [errorMessages, usernameHelper, emailHelper, passwordHelper]);


    return(
        <div >        
            <div>
                <div >
                    Please fill up the following information:-
                </div>
                <div >
                    <form onSubmit={handleSubmit}>
                        <label>Please enter your username:-</label>
                        <input type="text" ref={username} placeholder="Enter your username" onChange={() =>HandleInputChanges(0)}></input>
                        <p style={{display: errorMessages[0]}}>Please make sure that the username is between 8-28 characters.</p>
                        <br/>
                        <label htmlFor="email">Please enter your email:-</label>
                        <input type="text" ref={email} placeholder="Enter your email" onChange={() =>HandleInputChanges(1)}></input>
                        <p style={{display: errorMessages[1]}}>Please make sure that the email is valid(@gmail.com, @hotmail.com or @windowslive.com).</p>
                        <br/>
                        <label htmlFor="password">Please enter your password:-</label>
                        <input type="password" ref={password} onChange={() =>HandleInputChanges(2)} placeholder="Enter your password"></input>
                        <p style={{display: errorMessages[2]}}>Please make sure that the password is of atleast 10 character in length, containes a number and one of the following characters:- @, #, *, or &</p>
                        <br/>
                        <label htmlFor="username">Please enter your Date of birth:-</label>
                        <input type="date" ref={dob} placeholder="Enter your username" min="1990-01-01" max={new Date().toISOString().split("T")[0]}></input>
                        <button type="submit" disabled={!submit}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default SignUp;