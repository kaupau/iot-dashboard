import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Button, Pane } from 'evergreen-ui';
import EditSettingsTab from './editsettingstab';
import CurrentSettingsTab from './currentsettingstab';

export default function SettingsTab(props) {
    const [ editView, setEditView ] = useState(false); 
    const [ settings, setSettings ] = useState({
        device_id: 'cve24r3',
        name: 'Test Sensor',
        zone: 'Building ME314',
        description: 'This monitor has 3 sensors',
        fields: ['Temperature', 'Humidity'],
    });
    
    useEffect(() => {
        console.log("got po");
        axios.get(`/api/devices/dashboard/settings/${props.id}`).then(res => {
            setSettings(res.data);
            console.log("got sad");
        })
    }, [])

    
    return (
        <React.Fragment>
            <Pane backgroundColor="white" padding={16}>
                {
                    editView
                    ? <EditSettingsTab save={setEditView} id={props.id} settings={settings}/> 
                    : <CurrentSettingsTab save={setEditView} id={props.id} settings={settings} />  
                }
            </Pane>
        </React.Fragment>
    );
}