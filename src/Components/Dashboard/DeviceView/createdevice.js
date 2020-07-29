import React, { useState } from 'react';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Pane, Dialog, TextInput, Label, Textarea, Button, IconButton, majorScale, TextInputField, TagInput, toaster, Paragraph, Tooltip, Code, Position, Text } from 'evergreen-ui';

export default function CreateDevice() {
    const [createViewShown, setCreateViewShown] = useState(false);
    const [createdViewShown, setCreatedViewShown] = useState(false);
    const [device_id, setDevice_Id] = useState("");
    const [name, setName] = useState("");
    const [zone, setZone] = useState("");
    const [fields, setFields] = useState(['Temperature', 'Humidity']);
    const [description, setDescription] = useState("");

    function submitDeviceCreation() {
        axios.post('/api/devices/createdevice', {
            name: name,
            zone: zone,
            fields: fields,
            description: description,
        }).then(res => {
            if(res.status != 201)
                toaster.danger("Could not add device.", {id: 'forbidden-action'});
            else {
                setCreateViewShown(false);
                setCreatedViewShown(true);
                setDevice_Id(res.data.device_id);
                toaster.success("Success!", {description: 'Your device has been added to the dashboard.'});
            }
        }).catch(err => {
                toaster.danger("Could not connect to the server.", {id: 'forbidden-action', duration: 10, description: 'Try again at a later time. Server may be down.'});
        });
    }

    return (
        <React.Fragment>
            <Dialog
                isShown={createdViewShown}
                title="Create User"
                onCloseComplete={() => setCreatedViewShown(false)}
                confirmLabel="Done"
            >
                <Pane>
                <Paragraph marginBottom="default">
                    Configure your device to publish messages to the following topics:
                </Paragraph>

                    <Text size={500}>Your Device Key: </Text>
                    <Tooltip content="Click to copy to clipboard" position={Position.TOP}>
                    <CopyToClipboard text={device_id} onCopy={() => toaster.success("Copied to Clipboard!", {duration: 3})}>
                        <Code size={900}>{device_id}</Code>
                    </CopyToClipboard>
                    </Tooltip>

                </Pane>
            </Dialog>


            <Dialog
                isShown={createViewShown}
                title="Create Device"
                onCloseComplete={() => setCreateViewShown(false)}
                confirmLabel="Create Device"
                onConfirm={() => submitDeviceCreation()}
            >
                <Pane>
                    <TextInputField
                        label="Device Name"
                        description="This is how you can identify your devices on the dashboard."
                        placeholder="Device Name Here..."
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />

                    <TextInputField
                        label="Zone Name"
                        description="This is where your device is located."
                        placeholder="Device Zone Here..."
                        onChange={e => setZone(e.target.value)}
                        value={zone}
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
                        placeholder="Type in device description..."
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                    />

                </Pane>
            </Dialog>
{// toaster to notify success or error.
}
            <IconButton icon="plus" height={40} iconSize={30} appearance="minimal" onClick={() => setCreateViewShown(true)}/>
        </React.Fragment>
    );
}