import React, { Fragment, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet-src';
import icon from './icons8_marker.svg';

function Map({ latitude, longtitude }) {
    const position = [latitude, longtitude];
    const myIcon = L.icon({
        iconUrl: icon,
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });
    useEffect(() => {
        let d = document.getElementById('mymap');
        if (d) {
            createMap();
        }
    }, []);

    function createMap() {
        let mymap = L.map('mymap').setView(position, 17);
        L.tileLayer(
            'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 20,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken:
                    'pk.eyJ1IjoiY3VtYXBtYXAiLCJhIjoiY2s3Y3VhbTZxMDdmNzNsbDc4cGQyMnA1MyJ9.V1Q8GgOjQMAS56GxWqoWgA'
            }
        ).addTo(mymap);
        let marker = L.marker(position, { icon: myIcon }).addTo(mymap);
    }
    return <div style={{ width: '100%', height: '200px' }} id="mymap"></div>;
}
export default Map;
