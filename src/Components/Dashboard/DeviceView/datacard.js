import React from 'react';
import axios from 'axios';
import { Pane, Heading, Text, Badge, Avatar, Button, majorScale, TextInput, SideSheet, Position, toaster } from 'evergreen-ui';
import './datacard.css';
import DetailView from './DetailView/detailview';

export default class DataCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailedView: false,
            overview: {
                name: "Test Device",
                zone: "Building ME341",
                last_updated: "11:30pm",
            }
        }; 
    }

    componentDidMount () {
        axios.get(`/api/devices/dashboard/overviews/${this.props.id}`).then(res => {
            console.log(res.data);
            this.setState({overview: res.data});
        }).catch(err => {
            toaster.danger("Could not connect to server.");
        });
    }

    render  () {
        return (
        <div>
            <Pane 
                display="flex" 
                padding={16} 
                borderRadius={3}
                elevation={1}
                margin={majorScale(2)}
            >
                <Pane flex={1} alignItems="center" display="flex">
                    <Pane flexDirection="column" textAlign="left">
                        <Heading size={700} marginBottom={majorScale(1)}> {this.state.overview.name} </Heading>
                        <Text size={500}> {this.state.overview.zone} </Text> <br/>
                        <Text color="muted">Last Updated: {this.state.overview.last_updated}</Text>
                    </Pane>
                </Pane>
                <Pane>
                    {/* Below you can see the marginRight property on a Button. */}
                    <Button appearance="primary" onClick={() => this.setState({detailedView: true})}>More</Button>
                    <SideSheet
                        isShown={this.state.detailedView}
                        onCloseComplete={() => this.setState({detailedView: false})}
                        width={'80vw'}
                        position={Position.RIGHT}
                        containerProps={{
                            display: 'flex',
                            flex: '1',
                            flexDirection: 'column',
                        }}
                    >
                        <DetailView overview={this.state.overview} id={this.props.id} />
                    </SideSheet>
                </Pane>
            </Pane>
        </div>
        );
    }
}