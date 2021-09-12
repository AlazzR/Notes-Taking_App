import React from "react";
import { defualtBody } from '../../body_style';
import * as Validation from "../../utility/access";

type display = "block" | "none";

const SignIn: React.FC = ()=>{
    defualtBody();
    //email, password
    const email = React.useRef<HTMLInputElement>(null);
    const password = React.useRef<HTMLInputElement>(null);

    const [emailHelper, setEmail] = React.useState<boolean>(false);
    const [passwordHelper, setPassword] = React.useState<boolean>(false);
    const [submit, setSubmit] = React.useState<boolean>(false);
    const [errorMessages, setErrorMessages] = React.useState<Array<display>>( new Array
        (2).fill("none"));
    
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
            ChangeErrorState(0, Validation.CheckEmailValidity(email.current!.value));
        
        if(ind === 1)
            ChangeErrorState(1, Validation.CheckPasswordValidity(password.current!.value));

    }

    const handleSubmit: (event: React.FormEvent<HTMLFormElement>)=> void = (event)=>{
        event.preventDefault();
        //submit information to the backend side.
        console.log(email.current!.value);
        console.log(password.current!.value);
    }

    React.useEffect(()=>{
        console.log("************")
        if(Validation.CheckPasswordValidity(password.current!.value))
            setPassword(true);
        else
            setPassword(false);

        if(Validation.CheckEmailValidity(email.current!.value))
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
            <div>
                <div >
                    Please fill up the following information:-
                </div>
                <div >
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Please enter your email:-</label>
                        <input type="text" ref={email} placeholder="Enter your email" onChange={() =>HandleInputChanges(0)}></input>
                        <p style={{display: errorMessages[0]}}>Please make sure that the email is valid(@gmail.com, @hotmail.com or @windowslive.com).</p>
                        <br/>
                        <label htmlFor="password">Please enter your password:-</label>
                        <input type="password" ref={password} onChange={() =>HandleInputChanges(1)} placeholder="Enter your password"></input>
                        <p style={{display: errorMessages[1]}}>Please make sure that the password is of atleast 10 character in length, containes a number and one of the following characters:- @, #, *, or &</p>
                        <button type="submit" disabled={!submit}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default SignIn;