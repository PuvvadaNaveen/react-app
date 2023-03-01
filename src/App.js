import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import React, {Component} from "react";
import Header from './components/Header';
import { Container } from "reactstrap";
import MapComponent from "./components/Map";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applicationName: "Traffic Photo Data",
            data: null,
            api_url: 'https://data.edmonton.ca/resource/akzz-54k3.json'
        }
    }

    componentDidMount() {
        const {data, api_url} = this.state;

        if(!data){
            fetch(api_url, {method: 'GET'})
                .then(response => response.json())
                .then(response => this.createFeatureCollection(response))
                .then(response => this.setState({data: response}))
        }
    }

    createFeatureCollection(data) {
        let features = [];
        data.forEach((feature) => {
            features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        parseFloat(feature.longitude),
                        parseFloat(feature.latitude)
                    ]
                },
                "properties": {
                    "name": "Traffic Enforcement Cam's Edmond",
                    "description": feature.location_description,
                    "reason": feature.reason_code_s_,
                    "speedLimit": feature.speed_limit
                }
            })
        });

        return {
            "type": "FeatureCollection",
            "features": features
        }
    }
    render() {
        return (
            <div className="App">
                <Header appName={this.state.applicationName}/>

                <Container>
                    <MapComponent data={this.state.data}/>
                </Container>
            </div>
        )
    }
}

export default App;