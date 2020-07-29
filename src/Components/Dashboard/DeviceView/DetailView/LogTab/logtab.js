import React from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { Table, Menu, toaster, majorScale, Pane } from 'evergreen-ui';
import Scroll2 from './infinitelog';

export default class LogTab extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            logs: [
            ],
            hasMoreItems: true,
            maxItems: 10000000,
            loading: false,
        }
    }

    componentDidMount() {
        axios.post('/api/devices/log/count', {
            device_id: this.props.id
        }).then(res => {
            this.setState({maxItems: res.data.count});
            var offset = this.state.maxItems-this.state.logs.length;
            axios.post('/api/devices/log/', {
                device_id: this.props.id,
                limit: 20,
                offset: offset
            }).then(res => {
                this.setState({ logs: this.state.logs.concat(res.data)});
            })   
        });
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
                'Loaded all logs.', { duration: 1 }
            )
        }
        else if(this.state.loading != true)  {
                var offset = this.state.maxItems-this.state.logs.length-20;
                this.setState({loading: true});
                axios.post('/api/devices/log/', {
                    device_id: this.props.id,
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
            <React.Fragment>
                <Pane background="white" margin={majorScale(2)} borderRadius={3}> 
                <Table width="100%">
                    <Table.Head width={"100%"}> 
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
                        width={"97%"}
                        height="80%"
                        style={{"overflow-y": "auto"}}
                    >    
                    <Table.Body>

                    <div style={{height:'800px', overflow:'auto'}}>
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

                </Table>
                
                </Pane>
            </React.Fragment>
        )
    }
}