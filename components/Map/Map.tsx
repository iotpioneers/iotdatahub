import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useRouter } from "next/navigation";

function Map() {
  const mapPosition: any = [40, 0];

  return (
    <div className="h-full">
      <MapContainer
        center={[40, 0]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={[40, 0]}>
          <Popup>
            <span>🏙️</span> <span>Kicukiro - Rwanda</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }: any) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const router = useRouter();

  useMapEvents({
    click: (e) => router.push(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
