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

        map.on('load', () => {
            map.addLayer({
                "id": "points",
                "type": "circle",
                "source": {
                    "type": "geojson",
                    "data": this.state.data
                },
                "paint": {
                    "circle-radius": 5,
                    "circle-color": '#B4D455'
                }
            })
        });

        map.on('click', 'points', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { description, speedLimit, reason, name } = e.features[0].properties;

            while(Math.abs(e.lngLat.lng - coordinates[0]) > 100) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new MapboxGL.Popup()
                .setLngLat(coordinates)
                .setHTML(`
                <h6>${name}</h6><br />
                <h7>${description}</h7><br />
                <em><strong>Speed Limit: </strong>${speedLimit}</em><br />
                <p>${reason}</p>
                `)
                .addTo(map);
        });

        this.setState({ map });
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

    componentDidMount() {
        const {data, api_url} = this.state;

        if(!data){
            fetch(api_url, {method: 'GET'})
                .then(response => response.json())
                .then(response => this.createFeatureCollection(response))
                .then(response => this.setState({data: response}))
        }
    }

    render () {
        const { map, data } = this.state;
        if(data && !map) this.initializeMap()
        return (
            <div style={{width:900, height:750}} id="map" />
        )
    }
}