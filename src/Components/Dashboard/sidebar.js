import React, { useState } from 'react';
import { Pane, Text, Menu, Avatar, majorScale, TabNavigation, SidebarTab, Heading, Badge } from 'evergreen-ui';
import { BrowserRouter as Router, Link, Route, Redirect } from "react-router-dom";
import { useAuth } from '../Context/auth';
import './dashboard.css';
import DeviceView from './DeviceView/devices';

export default function SideBar (props) {
    const [currentView, setCurrentView] = useState(props.selected);

    const views = [
        {icon: "circle-arrow-right", text: "Manage Devices", href: "/", key: 0},
        {icon: "edit", text: "View Logs", href: "/logs", key: 1},
        {icon: "people", text: "Manage Users", href: "/users", key: 2},
    ]

    const { setAuthTokens } = useAuth();
    
    function logOut() {
        setAuthTokens();
        window.location.reload(false);
    }

    function redirect() {
        if(currentView!=props.selected)
            return <Redirect to={views[currentView].href}/>
    }

    return (
        <Pane
            width="20%"
            minWidth="20%"
            background="tint1" 
            elevation={4}
        >
            <Heading size={700} marginLeft={majorScale(2)} marginBottom={majorScale(2)} marginTop={32}>My Dashboard</Heading>
            <Menu>
                {redirect()}
                <Menu.Group title="Actions">
                    {
                        views.map((item) => 
                        (props.selected!=item.key) ? (
                            <Menu.Item height="80px" onSelect={() => setCurrentView(item.key)} icon={item.icon}>{item.text}</Menu.Item>
                        ) : (
                            <Menu.Item background="white" height="80px" icon={item.icon}>{item.text}</Menu.Item>
                        )
                    )}
                    <Menu.Item height="80px" onSelect={() => {logOut()}} icon="log-out" intent="danger">Logout</Menu.Item>
                </Menu.Group>
            </Menu>
        </Pane>
    );
}