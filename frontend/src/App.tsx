import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";
import { fancyBody } from './body_style';
const App: React.FC = ()=> {
  fancyBody();

  const foo = ()=>{
    axios({
      method: "GET",
      url: "http://localhost:5000"
    }).then(res => console.log(res.data)).catch(err => console.log(err));
  }
  foo();
  
  return (
    <div className="App">
        <div className="container-home">
          <div className="row">
            If you already a user, please sign-in. Otherwise, please sign-up.
          </div>

          <div className="row">
            <Link to="/sign-in">Sign-in</Link>            
          </div> 

          <div className="row">
            <Link to="/sign-up">Sign-up</Link>            
          </div> 
        </div>
    </div>
  );
}

export default App;
