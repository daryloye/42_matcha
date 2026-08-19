import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { Button, Input, useToaster, Notification } from 'rsuite';
import type { LocationData, Position } from '../../utils/types';
import { GetOpenMeteoGeocoding } from '../../api/profile';

function FlyToPosition({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return null;
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: Position | null;
  setPosition: (value: Position) => void;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          setPosition({
            lat: position.lat,
            lng: position.lng,
          })
        }
      },
    }),
    [],
  );

  if (!position) return null;

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>
        <p style={{ textAlign: 'center' }}>
          Drag this to set your location
          <br />({position.lat}, {position.lng})
        </p>
      </Popup>
    </Marker>
  );
}

export function ProfileLocation({
  position,
  setPosition,
}: {
  position: Position | null;
  setPosition: (value: Position) => void;
  }) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={13}
      scrollWheelZoom={true}
      className='h-[300px] w-full'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <LocationMarker position={position} setPosition={setPosition} />
      <FlyToPosition position={position} />
    </MapContainer>
  );
}

export function GPSButton({ setPosition }: { setPosition: (value: Position) => void }) {
  const toaster = useToaster();
  
  return (
    <Button
      type='button'
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
          (error) => {
            toaster.push(
              <Notification type='error' closable>
                {error.message}
              </Notification>
            );
          }
        );
      }}
    >
      Use GPS
    </Button>
  )
}

export function ManualLocation({ setPosition }: { setPosition: (value: any) => void }) {
  const [query, setQuery] = useState<string>("");
  const [location, setLocation] = useState<LocationData | null>(null);
  
  const toaster = useToaster();

  const fetchLocation = async (query: string) => {
    try {
      const res = await GetOpenMeteoGeocoding(query);
      const result = res.results;
      if (!result || !result[0]) return null;
      
      return ({
        country: result[0].country,
        city: result[0].name,
        latitude: result[0].latitude,
        longitude: result[0].longitude,
      });
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  }

  return (
    <div className='space-y-2'>
        <p className='text-base'>Or enter your location: </p>
      <div className='flex gap-2'>
        <Input
          name='location'
          placeholder='Your location'
          value={query}
          onChange={setQuery}
        />
        <Button
          type='button'
          onClick={async () => {
            const newLocation = await fetchLocation(query);
            if (!newLocation) return;
  
            setLocation(newLocation);
            setPosition({
              lat: newLocation.latitude,
              lng: newLocation.longitude
            })
          }}
        >
          Fetch Location
        </Button>
      </div>

      {location && (
        <div className='text-sm text-gray-600'>
          <p>{location.city}, {location.country}</p>
          <p>{location.latitude}, {location.longitude}</p>
        </div>
      )}
    </div>
  )
}
