import React, { useState } from 'react';
import { Pane, TextInput, Button, Menu, Text, Heading, Theme } from 'evergreen-ui';
import { useAuth } from '../Context/auth';
import axios from 'axios';
import './login.css';
import { Redirect } from 'react-router-dom';

export default function Login() {
    const [message, setMessage] = useState("");
    const [userName, setUsername] = useState("");
    const [fullName, setFullname] = useState("");
    const [passWord, setPassword] = useState("");
    const [api_key, setApi_Key] = useState("");


    const [loggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loginFailure, setLoginFailure] = useState(false);
    const { setAuthTokens } = useAuth();
    const { authTokens } = useAuth();
    
    function registerUser() {
        axios.post('http://localhost:4000/api/register', { // https://stackoverflow.com/questions/53083751/how-to-use-the-same-port-for-react-js-and-node-js/53084586
            fullname: userName,
            email: passWord,
            password: passWord,
            invite_key: api_key,
        }).then(response => {
            if (response.status === 200) {
                setAuthTokens(response.data);
                setLoggedIn(true);
            }
            else {
                setLoggedIn(false);
                loginFailure(true);
                setMessage("Sorry, your username or password does not match.");
            }
            
        }).catch(exception => {
            setIsError(true);
            setMessage("Sorry, there is a problem logging in on our end. We will fix it soon.");
        });
    }

    if(authTokens=="jackie") {    // check if correct authtoken
        return <Redirect to="/"/>;   
    }

    else {
    return (
        <div className="flex-container">
            <Pane
            background="#F9F9FB"
            height={450}
            width={400}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="default"
            elevation={4}
            className="login-pane"
            >
                <Heading size={900}>Welcome!</Heading>
                <Text marginBottom="16">Have a invite key? Create an account.</Text>
                <TextInput
                    name="text-input-name"
                    value={fullName}
                    placeholder="Enter Full Name..."
                    onChange={e => setFullname(e.target.value)}
                    marginTop={16}
                    width={270}
                />
                <TextInput
                    name="text-input-name"
                    value={userName}
                    placeholder="Enter Email..."
                    onChange={e => setUsername(e.target.value)}
                    marginTop={16}
                    width={270}
                />
                <TextInput
                    name="text-input-name"
                    value={passWord}
                    type="password"
                    placeholder="Create Password..."
                    onChange={e => setPassword(e.target.value)}
                    marginTop={16}
                    width={270}
                />
                <TextInput
                    name="text-input-name"
                    value={api_key}
                    type="password"
                    placeholder="Enter Invite Key..."
                    onChange={e => setApi_Key(e.target.value)}
                    marginTop={16}
                    width={270}
                />
                <Button appearance="primary" marginTop={16} onClick={registerUser}>Sign in</Button>
                <Text>{message}</Text>
            </Pane>
        </div>
    );
    }
}