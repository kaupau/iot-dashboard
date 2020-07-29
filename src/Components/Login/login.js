import React, { useState } from 'react';
import { Pane, TextInput, Button, Menu, Text, Heading, Theme, toaster } from 'evergreen-ui';
import { useAuth } from '../Context/auth';
import axios from 'axios';
import './login.css';
import { Redirect } from 'react-router-dom';

export default function Login() {
    const [message, setMessage] = useState("");
    const [userName, setUsername] = useState("");
    const [passWord, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const { setAuthTokens } = useAuth();
    const { authTokens } = useAuth();
    
    function loginUser() {
        axios.post('/api/login', { // https://stackoverflow.com/questions/53083751/how-to-use-the-same-port-for-react-js-and-node-js/53084586
            email: userName,
            password: passWord,
        }).then(response => {
            console.log(response.status);
            if (response.status == 200) {
                setAuthTokens("jackie");
                setLoggedIn(true);
                window.location.reload(false);
            }            
        }).catch(exception => {
            if (exception.response.status == 401 || exception.response.status == 409) {
                setLoggedIn(false);
                toaster.danger("Sorry, your username or password does not match.");
            }
            else {
                setLoggedIn(false);
                console.log(exception);
                toaster.danger("Sorry, there is a problem logging in on our end. We will fix it soon.");
            }
        });
    }

    if(authTokens=="jackie") {    // check if correct authtoken
        return <Redirect to="/devices"/>;   
    }

    else {
    return (
        <div className="flex-container">
            <Pane
            background="#F9F9FB"
            height={300}
            width={400}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="default"
            elevation={4}
            className="login-pane"
            >
                <Heading size={900}>Welcome Back!</Heading>
                <Text marginBottom="16">Sign in to view your dashboard.</Text>
                <TextInput
                    name="text-input-name"
                    value={userName}
                    placeholder="Enter Username..."
                    onChange={e => setUsername(e.target.value)}
                    marginTop={16}
                    width={270}
                />
                <TextInput
                    name="text-input-name"
                    value={passWord}
                    type="password"
                    placeholder="Enter Password..."
                    onChange={e => setPassword(e.target.value)}
                    marginTop={16}
                    width={270}
                />
                <Button appearance="primary" marginTop={16} onClick={loginUser}>Sign in</Button>
                <Button appearance="warning" marginTop={16} is="a" href="/register">Register</Button>
            </Pane>
        </div>
    );
    }
}