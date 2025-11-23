import { useAtom } from 'jotai';
import type { Marker as LeafletMarker } from "leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { locationAtom } from '../utils/atoms';

function LocationMarker() {
  const [position, setPosition] = useAtom(locationAtom);
  const markerRef = useRef<LeafletMarker | null>(null);
  
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  }), []);
  
  const map = useMap();

  useEffect(() => {
    map.locate();
  }, [map])

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>
        <p style={{ textAlign: 'center' }}>
          Drag this to set your location<br />
          ({position.lat.toFixed(3)}, {position.lng.toFixed(3)})
        </p>
      </Popup>
    </Marker>
  );
}

export function ProfileLocation() {
  return (
    <MapContainer
      center={[25.791, -80.130]}
      zoom={13}
      scrollWheelZoom={true}
      style={{height: '500px', width: '50%'}}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
