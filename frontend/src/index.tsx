import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './App';
import SignUp from './components/access/Sign-up';
import SignIn from "./components/access/Sign-in";
import { Notes } from "./components/notes/Notes";
import { NoteLink } from './components/notes/NoteLink';
import Users from "./components/users/Users";
import Error400page from "./components/errors/Error400page";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/"><App/></Route>
        <Route exact path="/sign-up"><SignUp /></Route>
        <Route exact path="/sign-in"><SignIn /></Route>
        <Route exact path="/users/:username/notes/note"><NoteLink /></Route>
        <Route exact path="/users/:username/notes/"><Notes /></Route>
        <Route exact path="/users"><Users /></Route>
        <Route exact path="*"><Error400page /></Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
