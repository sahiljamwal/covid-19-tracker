import React from "react";
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import "../Map.css";
import { showDataOnMap } from "../util";

const Map = ({ center, zoom, countries, casesType }) => {
  const ChangeMap = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  return (
    <div className="map">
      <LeafletMap>
        <ChangeMap center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
};

export default Map;
