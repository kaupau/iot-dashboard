import React from 'react'
import { Line } from 'react-chartjs-2';

export default function Graph(props) {
    return (
        <div>
            <Line
                height={300}
                options={{ maintainAspectRatio: false }}
                data={props.data}
            />
        </div>
    );
}