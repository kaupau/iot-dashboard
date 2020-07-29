import React from 'react';
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroller";
import SideBar from '../sidebar';
import { Pane, Text, Menu, Avatar, majorScale, TabNavigation, SidebarTab, Heading, Badge, Table, Popover, Position, toaster } from 'evergreen-ui';
import '../dashboard.css';

class LogView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: [
            ],
            hasMoreItems: true,
            maxItems: 10000000,
            loading: false,
        }

        const interval = setInterval(() => {
            const data = {
                from: "*",
                to: "*",
            };
            console.log("more items: "+this.state.hasMoreItems);
            //axios.post('/api/devices/log/', {device_id: "%"}).then(res => {
             //   console.log(res.data);
                //this.setState({Users: res.data});
            //});
        }, 5000);
    }

    componentDidMount() {
        axios.post('/api/devices/log/count', {
            device_id: "%"
        }).then(res => {
            this.setState({maxItems: res.data.count});  
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    showItems() {
        return this.state.logs.map(log => 
            <Table.Row key={log.device_id} isSelectable onSelect={() => 1+1}>
                <Table.TextCell>{log.device_id}</Table.TextCell>
                <Table.TextCell>{log.name}</Table.TextCell>
                <Table.TextCell>{log.zone}</Table.TextCell>
                <Table.TextCell>{log.field}</Table.TextCell>
                <Table.TextCell isNumber>{log.message}</Table.TextCell>
                <Table.TextCell>{log.time}</Table.TextCell>
            </Table.Row>
        );
    }

    loadMore() {
        if(this.state.logs.length>=this.state.maxItems)  {
            this.setState({ hasMoreItems: false});
            toaster.notify(
                'Loaded all logs.'
            )
        }
        else if(this.state.loading != true)  {
                var offset = this.state.maxItems-this.state.logs.length-20;
                this.setState({loading: true});
                axios.post('/api/devices/log/', {
                    device_id: "%",
                    limit: 20,
                    offset: offset
                }).then(res => {
                    this.setState({ logs: [...this.state.logs, ...res.data] });
                    this.setState({loading: false});
                })                
            
        }
    }

    render() {
        return (
            <div className="sidebar">
            <Pane
                height="100%"
                display="flex"
                flex-direction="row"
            >
                <SideBar selected={1}/> 
                <Pane width={"80%"}>
        
                    <Pane display="flex" paddingTop={37} paddingBottom={38} background="tint0" alignItems="center" >
                        <Pane flex={1} alignItems="center" display="flex">
                            <Heading size={900} marginLeft={majorScale(4)}>View Logs</Heading> 
                        </Pane>
                        <Pane marginRight={majorScale(4)}>
                            
                        </Pane>
                    </Pane>

                    <Table.Head marginLeft={majorScale(2)} width={"97%"}> 
                        <Table.TextHeaderCell>
                        ID
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                        Device
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                        Zone
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                        Field
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                        Message
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                        Timestamp
                        </Table.TextHeaderCell>
                    </Table.Head>

                    <Pane
                        marginLeft={majorScale(2)}
                        width={"97%"}
                        height="80%"
                        style={{"overflow-y": "auto"}}
                    >    
                        <Table.Body >
                        <div style={{height:'1000px', overflow:'auto'}}>
                        <InfiniteScroll
                            loadMore={this.loadMore.bind(this)}
                            hasMore={this.state.hasMoreItems}
                            loader={<div className="loader"> Loading... </div>}
                            useWindow={false}
                        >
                            
                            {this.showItems()}
                            
                        </InfiniteScroll>
                        </div>
                        </Table.Body>
                    </Pane>

                </Pane>
            </Pane>
            </div>
        );
    }
}

export default LogView;