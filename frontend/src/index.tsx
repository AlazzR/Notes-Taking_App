import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './App';
import SignUp from './components/access/Sign-up';
import SignIn from "./components/access/Sign-in";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/"><App/></Route>
        <Route exact path="/sign-up"><SignUp /></Route>
        <Route exact path="/sign-in"><SignIn /></Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
