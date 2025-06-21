import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';

const LatLngPicker = ({
    defaultLocation = { lat: 11.93882, lng: 105.492291 },
    onSelect,
    zoom = 15,
    height = '400px',
}) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const containerRef = useRef(null);
    const [currentLoc, setCurrentLoc] = useState(defaultLocation);

    // Icons via CSS classes
    const defaultIcon = L.divIcon({
        className: 'default-map-marker',
        html: '<div class="marker-pin"></div>',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });
    const selectedIcon = L.divIcon({
        className: 'selected-map-marker',
        html: '<div class="marker-pin"></div>',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });

    // init map + marker
    useEffect(() => {
        if (!containerRef.current) return;

        const map = L.map(containerRef.current).setView(
            [defaultLocation.lat, defaultLocation.lng],
            zoom
        );
        map.whenReady(() => setTimeout(() => map.invalidateSize(), 0));

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker(
            [defaultLocation.lat, defaultLocation.lng],
            { icon: defaultIcon, draggable: true }
        ).addTo(map);

        // click & drag handlers
        const notify = ({ lat, lng }) => {
            setCurrentLoc({ lat, lng });
            marker.setIcon(selectedIcon);
            onSelect({ lat, lng });
        };
        map.on('click', e => notify(e.latlng));
        marker.on('dragend', () => {
            const p = marker.getLatLng();
            notify({ lat: p.lat, lng: p.lng });
        });

        // store refs
        mapRef.current = map;
        markerRef.current = marker;

        // initial callback
        onSelect(defaultLocation);

        return () => map.remove();
    }, []);

    // if parent ever changes defaultLocation, reset:
    useEffect(() => {
        if (!mapRef.current || !markerRef.current) return;
        const { lat, lng } = defaultLocation;
        markerRef.current
            .setLatLng([lat, lng])
            .setIcon(defaultIcon);
        mapRef.current.setView([lat, lng], zoom);
        setCurrentLoc(defaultLocation);
        onSelect(defaultLocation);
    }, [defaultLocation.lat, defaultLocation.lng]);

    // reset button handler
    const resetToDefault = () => {
        const { lat, lng } = defaultLocation;
        markerRef.current
            .setLatLng([lat, lng])
            .setIcon(defaultIcon);
        mapRef.current.panTo([lat, lng]);
        setCurrentLoc({ lat, lng });
        onSelect({ lat, lng });
    };

    return (
        <div className="latlng-picker">
            {/* reset-to-default button */}
            <button
                className="reset-button"
                title="Reset to default"
                onClick={resetToDefault}
            >
                🏠
            </button>

            <div
                ref={containerRef}
                className="map-element"
                style={{ height }}
            />

            {/* optional: show coords */}
            <div className="coords-display">
                Lat: {currentLoc.lat.toFixed(6)}, Lng: {currentLoc.lng.toFixed(6)}
            </div>
        </div>
    );
};

export default LatLngPicker;
