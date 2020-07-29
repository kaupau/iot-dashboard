import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Pane, Text, IconButton } from 'evergreen-ui';
import Graph from './graph';
import EditGraph from './editgraph';

export default function DataTab(props) {
    const data = {
        labels: ["7/12", "7/13", "7/14", "7/15", "7/16", "7/17", "7/18"],
        datasets: [
            {   label: 'Temperature',
                data: [20,30,20,30,20,30,20],
                borderColor: "#3cba9f",
                fill: false,
            }
        ]
    };

    useEffect(() => {
        const interval = setInterval(() => {
          console.log('This will run every second!');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <React.Fragment>
            <Pane backgroundColor="white" padding={16}>
                <Text><b>Info: </b> Located in ME341. Monitors Air Temperature and Humidity.</Text>
            </Pane>
            <Pane display="flex" flex-direction="row">

                <Pane backgroundColor="white" padding={16} marginTop={16} marginRight={8} width={"50%"} borderRadius={5}>
                    <Pane display="flex">
                        <Pane display="flex" justifyContent="center" alignItems="left" flexDirection="column"  flex={1}>
                            <Text size={600}>Temperature</Text>
                            <Text size={400}>Current Value: 78° F</Text>
                        </Pane>
                        <Pane justifyContent="center">
                            <EditGraph/>
                        </Pane>
                    </Pane>
                    <Graph data={data}/>
                </Pane>

                <Pane backgroundColor="white" padding={16} marginTop={16} marginRight={8} width={"50%"} borderRadius={5}>
                    <Pane display="flex">
                        <Pane display="flex" justifyContent="center" alignItems="left" flexDirection="column"  flex={1}>
                            <Text size={600}>Humidity</Text>
                            <Text size={400}>Current Value: 78° F</Text>
                        </Pane>
                        <Pane justifyContent="center">
                            <EditGraph/>
                        </Pane>
                    </Pane>
                    <Graph data={data}/>
                </Pane>   

            </Pane>
        </React.Fragment>
    )
}