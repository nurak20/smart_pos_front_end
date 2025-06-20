// src/components/MapWithPicker.js
import React, { useState, useCallback, useMemo } from 'react';
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
} from '@react-google-maps/api';
import AddressPicker from './AddressPicker';

const containerStyle = {
    width: '100%',
    height: '400px',
};

// keep libraries in a top‑level constant so it never changes identity
const LIBRARIES = ['places'];

export default function MapWithPicker({ onAddressSelected }) {
    const [marker, setMarker] = useState(null);
    const [map, setMap] = useState(null);

    // load your key via import.meta.env – make sure your .env has VITE_GOOGLE_MAPS_API_KEY
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const onLoad = useCallback(mapInstance => {
        setMap(mapInstance);
    }, []);

    const reverseGeocode = useCallback(({ lat, lng }) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, results => {
            if (results[0]) {
                onAddressSelected({
                    address: results[0].formatted_address,
                    location: { lat, lng },
                });
            }
        });
    }, [onAddressSelected]);

    const handleMapClick = useCallback(e => {
        const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarker(loc);
        reverseGeocode(loc);
    }, [reverseGeocode]);

    const handlePlaceChanged = useCallback(({ address, location }) => {
        setMarker(location);
        map.panTo(location);
        onAddressSelected({ address, location });
    }, [map, onAddressSelected]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps…</div>;

    return (
        <div>
            <AddressPicker onPlaceChanged={handlePlaceChanged} />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={marker || { lat: 11.5564, lng: 104.9282 }}
                zoom={marker ? 15 : 8}
                onLoad={onLoad}
                onClick={handleMapClick}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
        </div>
    );
}
