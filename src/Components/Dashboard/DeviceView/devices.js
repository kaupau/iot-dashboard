import React from 'react';
import { Pane, majorScale, Heading, toaster } from 'evergreen-ui';
import SideBar from '../sidebar';
import DataCard from './datacard';
import CreateDevice from './createdevice';
import axios from 'axios';


export default class DeviceView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [
                
            ]
        }
    }

    componentDidMount () {
        axios.get('/api/devices/dashboard/overviews/').then(res => {
            this.setState({devices: res.data.devices});
        }).catch(err => {
            console.log(err);
            toaster.danger("Could not connect to server.");
        });
        console.log("mounted");
    }

    render() {
        return  (
        <div className="sidebar">

            <Pane
                height="100%"
                display="flex"
                flex-direction="row"
            >
                <SideBar selected={0}/> 
                
                <Pane width={"80%"}>
            
                    <Pane display="flex" paddingTop={37} paddingBottom={38} background="tint0" alignItems="center" >
                        <Pane flex={1} alignItems="center" display="flex">
                            <Heading size={900} marginLeft={majorScale(4)}>Manage Devices</Heading> 
                        </Pane>
                        <Pane marginRight={majorScale(4)}>
                            <CreateDevice/>
                        </Pane>
                    </Pane>

                    <Pane
                        marginLeft={majorScale(2)}
                        display="flex"
                        flex-direction="column"
                        width={"100%"}
                    >
                        {this.state.devices.map((device) => <DataCard id={device.device_id}/> )}
                    </Pane>

                </Pane>
            </Pane>
        </div>
        );
    }
}