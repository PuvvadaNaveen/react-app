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
            applicationName: "Traffic Photo Data"
        }
    }

    render() {
        return (
            <div className="App">
                <Header appName={this.state.applicationName}/>

                <Container>
                    <MapComponent/>
                </Container>
            </div>
        )
    }
}

export default App;