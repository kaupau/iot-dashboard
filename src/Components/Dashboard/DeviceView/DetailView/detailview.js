import React, { useState } from 'react';
import { Pane, Heading, Paragraph, Text, majorScale, TabNavigation, Tab, Li } from 'evergreen-ui';
import { Line } from 'react-chartjs-2';
import DataTab from './DataTab/datatab';
import LogTab from './LogTab/logtab';
import SettingsTab from './SettingsTab/settingstab'

export default function DetailView(props) {
    const [selectedIndex, setSelected] = useState(0);

    const tabs = [
        {
            name: 'Data',
            item: <DataTab id={props.id} />,
        },
        {
            name: 'Log',
            item: <LogTab id={props.id} />,
        },
        {
            name: 'Settings',
            item: <SettingsTab id={props.id} />,
        }
    ];

    return (
        <React.Fragment>
            <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
                <Pane
                    padding={16}
                >
                <Heading size={600}> {props.overview.name} </Heading>
                <Paragraph size={400} color="muted"> {props.overview.zone} </Paragraph>
                <Paragraph size={400} color="muted">Last Updated: {props.overview.lastUpdate}</Paragraph>
                </Pane>
            </Pane>
            <Pane elevation={0} backgroundColor="white" padding={16}>
                <TabNavigation>
                    {tabs.map((tab, index) => (
                    <Tab key={tab.name} isSelected={index===selectedIndex} onSelect={() => setSelected(index)}>{tab.name}</Tab>
                    ))}
                </TabNavigation>
            </Pane>
            <Pane padding={16} background="tint1" flex={1}> 
                {tabs.map((tab, index) => (
                    <Pane             
                        aria-hidden={index !== selectedIndex}
                        display={index === selectedIndex ? 'block' : 'none'}
                    >
                        {tab.item}
                    </Pane>
                ))}
            </Pane>
        </React.Fragment>
    );
}