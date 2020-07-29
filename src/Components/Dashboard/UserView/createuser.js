import React, { useState } from 'react';
import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Pane, Dialog, TextInput, Label, Textarea, Button, IconButton, majorScale, TextInputField, TagInput, Text, Code, toaster, Tooltip, Position, Paragraph } from 'evergreen-ui';

export default function CreateUser() {
    const [createViewShown, setCreateViewShown] = useState(false);
    const [inviteKey, setInviteKey] = useState("KEY INVALID");

    function submitSensorCreation() {
        alert("submitted");
        setCreateViewShown(false);
    }

    function generateInviteKey() {
        axios.post('/api/users/generateinvitekey').then(res => {
            if(res.status !== 201)
            {
                toaster.danger("Error generating an invite key.", {duration: 3});
                setInviteKey("KEY INVALID");
            } else {
                setInviteKey(res.data.invite_key);
            }
        }).catch(err => {
            toaster.danger("Error generating an invite key. Could not connect to server", {duration: 10});
            setInviteKey("KEY INVALID");
        });
        setCreateViewShown(true);
    }

    return (
        <React.Fragment>
            <Dialog
                isShown={createViewShown}
                title="Create User"
                onCloseComplete={() => setCreateViewShown(false)}
                confirmLabel="Create User"
                onConfirm={() => submitSensorCreation()}
            >
                <Pane>
                <Paragraph marginBottom="default">
                    Send your invite key to the person whom you want to add as a user and let them register. This invite key can only be used once.
                </Paragraph>

                    <Text size={500}>Your Invite Key: </Text>
                    <Tooltip content="Click to copy to clipboard" position={Position.TOP}>
                    <CopyToClipboard text={inviteKey} onCopy={() => toaster.success("Copied to Clipboard!", {duration: 3})}>
                        <Code size={900}>{inviteKey}</Code>
                    </CopyToClipboard>
                    </Tooltip>

                </Pane>
            </Dialog>
{
}
            <IconButton icon="plus" height={40} iconSize={30} appearance="minimal" onClick={() => generateInviteKey()}/>
        </React.Fragment>
    );
}