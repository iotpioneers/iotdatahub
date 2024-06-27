"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from "./Map.module.css";

function MapComponent() {
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[-1.991900958762265, 30.09548102322638]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={[-1.991900958762265, 30.09548102322638]}>
          <Popup>
            <span>🏙️</span> <span>Kicukiro - Rwanda</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
