import React, { Component } from 'react';
import Map, { Marker } from 'react-map-gl';
import Pin from './Pin';
export default class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            api_url: 'https://data.edmonton.ca/resource/akzz-54k3.json',
            viewState: {
                zoom: 14,
                longitude: -113.4796,
                latitude: 53.6028
            },
            coords: [
                { longitude:-113.4909, latitude:53.5444 },
                { longitude:-113.6242, latitude:53.5225 },
                { longitude:-113.4914, latitude:53.5439 }
            ],
            data: null
        }
    }

    componentDidMount() {
        const {data, api_url} = this.state;

        if(!data){
            fetch(api_url, {method: 'GET'})
                .then(response => response.json())
                .then(response => this.setState({data: response}))
        }
    }

    render () {
        const { coords, data } = this.state;
        return (
            <Map
                {...this.state.viewState}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                style={{width: 700,height: 600}}
                onMove={(viewState) =>
                    this.setState({viewState})
                }>
                {data && data.map((coord, i) => (
                    <Marker key={i} longitude={coord.longitude} latitude={coord.latitude} color="red">
                        <Pin />
                    </Marker>
                ))}
            </Map>
        )
    }
}