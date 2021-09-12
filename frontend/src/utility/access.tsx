
const CheckUsernameValidity: (username: string | null)=>boolean = (username)=>{
    if(username === null)
        return false;

    if(username.length >= 8 && username.length <= 28)
        return true;
    return false;
}


const CheckEmailValidity: (email: string | null)=>boolean = (email)=>{
    if(email === null)
        return false;

    const putativeMatches = ["@gmail.com", "@windowslive.com", "@hotmail.com"];
    if(putativeMatches.filter(item => email.endsWith(item)).length > 0)
        return true;
    return false;
}

const CheckPasswordValidity: (password: string | null)=>boolean = (password)=>{
    if(password === null)
        return false;
    if(password.length >= 10 && password.match(/[0-9]/) !== null && (password.includes("@") || password.includes("#") || password.includes("*") || password.includes("&")))
        return true;
    return false;
}

export {
    CheckUsernameValidity,
    CheckEmailValidity,
    CheckPasswordValidity
}