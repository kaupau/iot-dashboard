import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Pane, TextInputField, Label, TagInput, majorScale, Textarea, toaster } from 'evergreen-ui';

export default function EditSettingsTab(props) {
    const [name, setName] = useState(props.settings.name);
    const [zone, setZone] = useState(props.settings.zone);
    const [fields, setFields] = useState(props.settings.fields);
    const [description, setDescription] = useState(props.settings.description);

    function submit() {
        axios.post(`/api/devices/dashboard/settings/${props.id}`, {
            device_id: props.device_id,
            name: name,
            zone: zone,
            fields: fields,
            description: description
        }).then(res => {
            if(res.status == 201) {
                props.save(false);
                toaster.success("Success!", {duration: 3, description: 'Your changes have been saved.'});
//                window.location.reload(false);
            }
        }).catch(err => {
                if (err.response.status == 500)
                    toaster.danger("Could not save changes.", {id: 'forbidden-action'});
                else 
                    toaster.danger("Could not connect to the server.", {id: 'forbidden-action', duration: 4, description: 'Try again at a later time. Server may be down.'});
        });
    }

    function deleteDevice() {
        axios.delete(`/api/devices/dashboard/settings/${props.id}/delete`).then(res => {
            if(res.status != 204)
                toaster.danger("Could not save changes.", {id: 'forbidden-action'});
            else {
                props.save(false);
                toaster.success("Success!", {duration: 3, description: 'Device has been deleted. Please reload page.'});
//                window.location.reload(false);
            }
        }).catch(err => {
                toaster.danger("Could not connect to the server.", {id: 'forbidden-action', duration: 4, description: 'Try again at a later time. Server may be down.'});
        });
    }

    return (
        <React.Fragment>
            <Pane backgroundColor="white" padding={16}>
                <TextInputField
                    label="Sensor Name"
                    description="This is how you can identify your sensors on the dashboard."
                    placeholder="Sensor Name Here..."
                    value={name}
                    onChange={value => setName(value.target.value)}
                />

                <TextInputField
                    label="Zone Name"
                    description="This is where your sensor is located."
                    placeholder="Sensor Zone Here..."
                    value={zone}
                    onChange={value => setZone(value.target.value)}
                />          
                
                <Label
                    htmlFor="textarea-2"
                    marginBottom={4}
                    display="block"
                >Input the Resource Fields</Label>
                <TagInput
                    marginBottom={majorScale(2)}
                    width="100%"
                    inputProps={{ placeholder: 'Add fields...' }}
                    values={fields}
                    onChange={values => {
                        setFields(values)
                    }}
                />


                <Label
                    htmlFor="textarea-2"
                    marginBottom={4}
                    display="block"
                >
                    Description
                </Label>
                <Textarea
                    id="textarea-2"
                    placeholder="Type in sensor description..."
                    value={description}
                    onChange={value => setDescription(value.target.value)}
                />

                <Pane display="flex">
                    <Pane flex={1} alignItems="center" display="flex">
                        <Button marginRight={12} marginTop={"default"} iconBefore="saved" onClick={() => submit()}>Submit</Button>
                        <Button marginRight={12} marginTop={"default"} iconBefore="cross" onClick={() => props.save(false)}>Cancel</Button>
                    </Pane>
                    <Pane>
                        <Button marginRight={12} marginTop={"default"} iconBefore="trash" onClick={() => deleteDevice()} intent="danger">Delete</Button>
                    </Pane>
                </Pane>
            </Pane>
        </React.Fragment>
    )
}