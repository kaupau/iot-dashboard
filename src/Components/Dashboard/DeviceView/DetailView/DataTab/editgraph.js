import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, IconButton, toaster } from 'evergreen-ui';

export default function EditGraph(props) {
    const [ isShown, setShown ] = useState(false);

    function submitGraphChanges() {
        axios.post(`localhost:4000/api/dashboard/${props.id}/${props.resource}/graph`, {
            name: "",
        }).then(res => {
            if(res != 201)
                toaster.danger("Could not add sensor.", {id: 'forbidden-action'});
            else {
                setShown(false);
                toaster.success("Success!", {duration: 3, description: 'Your sensor has been added to the dashboard.'});
                window.location.reload(false);
            }
        }).catch(err => {
                toaster.danger("Could not connect to the server.", {id: 'forbidden-action', duration: 10, description: 'Try again at a later time. Server may be down.'});
        });
    }

    return (
        <React.Fragment>
            <Dialog
                isShown={isShown}
                title="Change Graph Settings"
                onCloseComplete={() => setShown(false)}
                onConfirm={() => submitGraphChanges()}
                confirmLabel="Confirm Changes"
            >
        
            </Dialog>
            <IconButton marginBottom={16} appearance="minimal" icon="edit" onClick={() => setShown(true)} />
        </React.Fragment>
    );
}