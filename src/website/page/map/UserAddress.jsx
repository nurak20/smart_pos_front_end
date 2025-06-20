import React, { useState } from 'react';
import LatLngPicker from './LatLng';
import './style.css'; // We'll create this stylesheet
import OpenStreetMapGeocoder from './GoogleMapsGeocoder';

const UserAddress = () => {
    const [coords, setCoords] = useState(null);
    const [address, setAddress] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        if (!coords) return;

        const coordText = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
        navigator.clipboard.writeText(coordText);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    // Optional: Reverse geocoding to get address from coordinates
    async function getAddress(lat, lng) {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        console.log(data);
        if (data.status === 'OK' && data.results.length) {
            setAddress(data.results[0].formatted_address);
        } else {
            setAddress('Address not found');
        }
    }


    const handleCoordsSelect = (newCoords) => {
        setCoords(newCoords);
        if (newCoords) {
            getAddress(newCoords.lat, newCoords.lng);
        }
    };

    return (
        <div className="location-picker-container">
            <div className="location-header">
                <h1>Select Your Location</h1>
                <p className="subtitle">Click anywhere on the map to set your exact coordinates</p>
            </div>

            <div className="map-container">
                <LatLngPicker onSelect={handleCoordsSelect} />

                {coords && (
                    <div className="pin-marker" aria-label="Location selected">
                        <div className="pin-head"></div>
                        <div className="pin-tail"></div>
                    </div>
                )}
            </div>

            {coords && (
                <div className="coordinates-display">
                    <div className="coordinates-card">
                        <h2>Selected Location</h2>

                        <div className="coords-row">
                            <div className="coord-item">
                                <span className="coord-label">Latitude</span>
                                <span className="coord-value">{coords.lat.toFixed(6)}°</span>
                            </div>
                            <div className="coord-item">
                                <span className="coord-label">Longitude</span>
                                <span className="coord-value">{coords.lng.toFixed(6)}°</span>
                            </div>
                        </div>

                        {/* {address && (
                            <div className="address-display">
                                <span className="address-label">Address</span>
                                <span className="address-value">{address}</span>
                            </div>
                        )} */}
                        <div>
                            <OpenStreetMapGeocoder lat={coords.lat} lng={coords.lng} />
                        </div>

                        <div className="action-buttons">
                            <button
                                className="copy-button"
                                onClick={copyToClipboard}
                            >
                                {isCopied ? 'Copied!' : 'Copy Coordinates'}
                            </button>
                            <button className="confirm-button">Confirm Location</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAddress;