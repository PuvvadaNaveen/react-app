import React, { Component } from 'react';
import MapboxGL from 'mapbox-gl';

export default class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            api_url: 'https://data.edmonton.ca/resource/akzz-54k3.json',
            map: false,
            viewState: {
                zoom: 14,
                center: [ -113.4796, 53.6028 ]
            },
            data: null
        }
    }

    initializeMap() {
        MapboxGL.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        let map = new MapboxGL.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            ...this.state.viewState
        });

        this.setState({ map });
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
        const { map, data } = this.state;
        if(data && !map) this.initializeMap()
        return (
            // <Map
            //     {...this.state.viewState}
            //     mapStyle="mapbox://styles/mapbox/streets-v9"
            //     mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            //     style={{width: 700,height: 600}}
            //     onMove={(viewState) =>
            //         this.setState({viewState})
            //     }>
            //     {data && data.map((coord, i) => (
            //         <Marker key={i} longitude={coord.longitude} latitude={coord.latitude} color="red">
            //             <Pin />
            //         </Marker>
            //     ))}
            // </Map>
            <div style={{width:900, height:750}} id="map" />
        )
    }
}