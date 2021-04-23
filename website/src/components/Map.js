import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default class Map extends React.Component {
    render() {
        return (
            <MapContainer center={this.props.coordinates} zoom={15} scrollWheelZoom={false} className="z-0 rounded-lg h-96">
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={this.props.coordinates}>
                <Popup>
                    {this.props.title}
                </Popup>
            </Marker>
        </MapContainer>
        )
    }
}