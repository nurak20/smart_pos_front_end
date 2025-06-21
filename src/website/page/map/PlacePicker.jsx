// src/components/PlacePicker.jsx
import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

// pick exactly the fields you need for performance
const AUTOCOMPLETE_OPTIONS = {
    fields: [
        'place_id',
        'name',
        'formatted_address',
        'geometry.location'
    ],
    // types: ['establishment'],    // uncomment to restrict to businesses
};

export default function PlacePicker({ onPlaceSelected }) {
    const autocompleteRef = useRef(null);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.place_id) {
            console.warn('No place selected');
            return;
        }
        // bubble up the full place object
        onPlaceSelected(place);
    };

    return (
        <Autocomplete
            onLoad={autocomplete => { autocompleteRef.current = autocomplete; }}
            onPlaceChanged={handlePlaceChanged}
            options={AUTOCOMPLETE_OPTIONS}
        >
            <input
                type="text"
                placeholder="Search for a place..."
                style={{
                    boxSizing: 'border-box',
                    border: '1px solid transparent',
                    width: '300px',
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
