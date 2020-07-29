import React, { useEffect, useState } from 'react';
import { Button, Text, Pane, majorScale, Heading, TextInputField, Label, TagInput, Textarea } from 'evergreen-ui';
import axios from 'axios';

export default function CurrentSettingsTab(props) {
    return (
        <React.Fragment>
            <Pane backgroundColor="white" padding={16}>
                <TextInputField
                    label="Sensor Name"
                    description="This is how you can identify your sensors on the dashboard."
                    disabled
                    value={props.settings.name}
                />

                <TextInputField
                    label="Zone Name"
                    description="This is where your sensor is located."
                    placeholder="Sensor Zone Here..."
                    disabled
                    value={props.settings.zone}
                />          
                
                <Label
                    htmlFor="textarea-2"
                    marginBottom={4}
                    display="block"
                >Resource Fields</Label>
                <TagInput
                    marginBottom={majorScale(2)}
                    width="100%"
                    inputProps={{ placeholder: 'Add fields...' }}
                    values={props.settings.fields}
                    disableds
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
                    disabled
                    value={props.settings.description}
                />

                <Button marginRight={12} marginTop={"default"} iconBefore="edit" onClick={() => props.save(true)}>Edit Settings</Button>
            
            </Pane>
        </React.Fragment>
    )
}