import React from 'react';
import {Constants, Svg} from 'expo';

const {Circle, Text} = Svg;

class TopScreenTemp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temp: 25
        }
    }

    render() {
        return (
            <Svg height={100} width={100}>
            <Svg.Circle
            cx={50}
            cy={50}
            r={45}
            strokeWidth={2.5}
            //stroke="#DADAFF"
            fill="rgb(224,0,0)"
          />
            <Text
            fill="white"
            //stroke="black"
            fontSize="30"
            fontWeight="bold"
            x="35"
            y="60"
            textAnchor="middle">{this.props.temp}°F</Text>
            <Text
            fill="black"
            //stroke="black"
            fontSize="15"
            fontWeight="bold"
            x="45"
            y="85"
            textAnchor="middle">{this.props.carTemp}°F</Text>
        </Svg>
        )
    }

}

export default TopScreenTemp
