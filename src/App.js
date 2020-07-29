import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { AuthContext } from './Components/Context/auth';
import PrivateRoute from './Components/Context/PrivateRoute';

import './App.css';
import Login from './Components/Login/login';
import Register from './Components/Login/register';
import DeviceView from './Components/Dashboard/DeviceView/devices';
import LogView from './Components/Dashboard/LogView/logs';
import UserView from './Components/Dashboard/UserView/users';


function App() {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    if(data==null)
      localStorage.removeItem("tokens");
    else
      localStorage.setItem("tokens", JSON.stringify(data));
  }

  return (
    <div className="App">
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
      <Router>
          <PrivateRoute exact path="/" component={DeviceView}/>
          <PrivateRoute exact path="/devices" component={DeviceView}/>
          <PrivateRoute exact path="/users" component={UserView}/>
          <PrivateRoute exact path="/logs" component={LogView}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
      </Router>
    </AuthContext.Provider>
    </div>
  );
}

export default App;