import React, { Component } from 'react';
import MapboxGL from 'mapbox-gl';

export default class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            map: false,
            viewState: {
                zoom: 14,
                center: [ -113.4796, 53.6028 ]
            }
        }
    }

    static initializeMap(state, viewState) {
        MapboxGL.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        let map = new MapboxGL.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            ...viewState
        });

        map.on('load', () => {
            map.addLayer({
                "id": "points",
                "type": "circle",
                "source": {
                    "type": "geojson",
                    "data": state.data
                },
                "paint": {
                    "circle-radius": 6,
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

        map.on('mouseenter', 'points', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'points', () => {
            map.getCanvas().style.cursor = '';
        });

        return { map };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { map, data } = nextProps;
        if(data && !map) return MapComponent.initializeMap(nextProps, prevState.viewState);
        else return null;
    };

    render () {
        return (
            <div style={{width:900, height:750}} id="map" />
        )
    }
}