// src/components/AddressPicker.js
import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

// define options once, not inline, to avoid unnecessary re‑renders
const AUTOCOMPLETE_OPTIONS = {
    fields: ['formatted_address', 'geometry'],
    // types: ['address'],
};

export default function AddressPicker({ onPlaceChanged }) {
    const autocompleteRef = useRef(null);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;
        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
        onPlaceChanged({
            address: place.formatted_address,
            location,
        });
    };

    return (
        <Autocomplete
            onLoad={auto => (autocompleteRef.current = auto)}
            onPlaceChanged={handlePlaceChanged}
            options={AUTOCOMPLETE_OPTIONS}
        >
            <input
                type="text"
                placeholder="Search address..."
                style={{
                    boxSizing: 'border-box',
                    border: '1px solid transparent',
                    width: '240px',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '3px',
                    fontSize: '16px',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                }}
            />
        </Autocomplete>
    );
}
