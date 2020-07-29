import React, { useState } from 'react';
import { Pane, TextInput, Button, Menu, Text, Heading, Theme, toaster } from 'evergreen-ui';
import { useAuth } from '../Context/auth';
import axios from 'axios';
import './login.css';
import { Redirect } from 'react-router-dom';

export default function Login() {
    const [userName, setUsername] = useState("");
    const [fullName, setFullname] = useState("");
    const [passWord, setPassword] = useState("");
    const [api_key, setApi_Key] = useState("");


    const [loggedIn, setLoggedIn] = useState(false);
    const { setAuthTokens } = useAuth();
    const { authTokens } = useAuth();
    
    function registerUser() {
        axios.post('/api/register', { // https://stackoverflow.com/questions/53083751/how-to-use-the-same-port-for-react-js-and-node-js/53084586
            fullname: fullName,
            email: userName,
            password: passWord,
            invite_key: api_key,
        }).then(response => {
            if (response.status == 201) {
                setAuthTokens("jackie");
                setLoggedIn(true);
                window.location.reload(false);
            }
        }).catch(exception => {
            if (exception.response.status == 401 || exception.response.status == 409) {
                setLoggedIn(false);
                toaster.danger("There is already an account associated with your email, or the invite key has expired.");
            }
            else {
                setLoggedIn(false);
                console.log(exception);
                toaster.danger("Sorry, there is a problem logging in on our end. We will fix it soon.");
            }
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
            </Pane>
        </div>
    );
    }
}