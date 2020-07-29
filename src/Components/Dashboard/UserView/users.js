import React, { useState } from 'react';
import { Pane, Text, Menu, Avatar, majorScale, TabNavigation, SidebarTab, Heading, Badge, Table, Popover, Position } from 'evergreen-ui';
import SideBar from '../sidebar';
import CreateUser from './createuser';
import axios from 'axios';

export default class UserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Users: [
                {fullname: " ", email: " "},
            ]
        }
    }

    componentDidMount () {
        axios.get('http://localhost:4000/api/users').then(res => {
            this.setState({Users: res.data.users});
        });
    }

    render () {
        return (
        <div className="sidebar">
            <Pane
                height="100%"
                display="flex"
                flex-direction="row"
            >
                <SideBar selected={2}/> 

                <Pane width={"80%"}>
                <Pane display="flex" paddingTop={37} paddingBottom={38} background="tint0" alignItems="center" >
                    <Pane flex={1} alignItems="center" display="flex">
                        <Heading size={900} marginLeft={majorScale(4)}>Manage Users</Heading> 
                    </Pane>
                    <Pane marginRight={majorScale(4)}>
                        <CreateUser/>
                    </Pane>
                </Pane>

                <Pane
                    margin={majorScale(2)}
                    display="flex"
                    flex-direction="row"
                    width={"80%"}
                >
                    
                    <Table width="100%">
                        <Table.Head>
                            <Table.SearchHeaderCell />
                            <Table.TextHeaderCell>
                            Contact
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                            User ID
                            </Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body>

                            {this.state.Users.map((user, index)=> 
                                <Popover
                                position={Position.BOTTOM_RIGHT}
                                content={
                                    <Menu>
                                        <Menu.Group title="Actions">
                                        <Menu.Item icon="people">Share...</Menu.Item>
                                        <Menu.Item icon="trash" intent="danger">
                                            Delete...
                                        </Menu.Item>
                                        </Menu.Group>
                                    </Menu>
                                }
                                >

                                    <Table.Row key={index} isSelectable>
                                        <Table.TextCell>{user.fullname}</Table.TextCell>
                                        <Table.TextCell>{user.email}</Table.TextCell>
                                        {/*<Table.TextCell isNumber>{user.ID}</Table.TextCell>*/}
                                    </Table.Row>
                                    
                                </Popover>
                            )}

                        </Table.Body>
                    </Table>

                </Pane>
                </Pane>
            </Pane>
        </div>
        );
    }
}