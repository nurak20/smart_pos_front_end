import React, { useState, useEffect } from 'react';

// This component will use Leaflet for maps, which requires some CSS and JS
// The imports below would normally need to be installed with npm:
// npm install leaflet react-leaflet

const LeafletMap = () => {
    const [lat, setLat] = useState('11.938820');
    const [lng, setLng] = useState('105.492291');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mapInitialized, setMapInitialized] = useState(false);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    const handleLatChange = (e) => setLat(e.target.value);
    const handleLngChange = (e) => setLng(e.target.value);

    // Initialize the map when component mounts
    useEffect(() => {
        // Add Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
        }

        // Add Leaflet JS
        if (!document.getElementById('leaflet-js')) {
            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = () => {
                initMap();
            };
            document.body.appendChild(script);
        } else if (window.L) {
            initMap();
        }

        return () => {
            // Cleanup map on component unmount
            if (map) {
                map.remove();
            }
        };
    }, []);

    // Update marker position when lat/lng changes
    useEffect(() => {
        if (map && marker && isValidCoordinates()) {
            const position = [parseFloat(lat), parseFloat(lng)];
            marker.setLatLng(position);
            map.setView(position, 13);

            // Get address for the new position
            getAddress();
        }
    }, [lat, lng, map, marker]);

    const initMap = () => {
        if (window.L && !mapInitialized) {
            // Create map instance
            const mapInstance = window.L.map('mapContainer').setView([parseFloat(lat), parseFloat(lng)], 13);

            // Add OpenStreetMap tiles (free)
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);

            // Add marker for the coordinates
            const markerInstance = window.L.marker([parseFloat(lat), parseFloat(lng)]).addTo(mapInstance);

            // Save references
            setMap(mapInstance);
            setMarker(markerInstance);
            setMapInitialized(true);

            // Get address for initial position
            getAddress();

            // Add click handler to update coordinates when clicking on map
            mapInstance.on('click', (e) => {
                setLat(e.latlng.lat.toFixed(6));
                setLng(e.latlng.lng.toFixed(6));
            });
        }
    };

    const isValidCoordinates = () => {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        return !isNaN(latNum) && !isNaN(lngNum) &&
            latNum >= -90 && latNum <= 90 &&
            lngNum >= -180 && lngNum <= 180;
    };

    const getAddress = async () => {
        if (!isValidCoordinates()) {
            setError('Please enter valid coordinates');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Using OpenStreetMap Nominatim API - completely free with no key required
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'LeafletMapComponent/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.display_name) {
                setAddress(data.display_name);

                if (marker) {
                    marker.bindPopup(data.display_name).openPopup();
                }
            } else {
                setError('No address found for these coordinates');
            }
        } catch (err) {
            setError(`Failed to fetch address: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateMap = () => {
        if (isValidCoordinates() && map && marker) {
            const position = [parseFloat(lat), parseFloat(lng)];
            marker.setLatLng(position);
            map.setView(position, 13);
            getAddress();
        } else {
            setError('Please enter valid coordinates');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
            <h1 className="text-xl font-bold mb-4">Interactive Map</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                        type="text"
                        value={lat}
                        onChange={handleLatChange}
                        placeholder="e.g. 11.938820"
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                        type="text"
                        value={lng}
                        onChange={handleLngChange}
                        placeholder="e.g. 105.492291"
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={updateMap}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
                    >
                        {loading ? 'Loading...' : 'Update Map'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Map container */}
            <div
                id="mapContainer"
                className="w-full h-96 mt-4 rounded-lg border border-gray-300"
            ></div>

            {address && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Address:</h2>
                    <p className="p-3 bg-gray-100 rounded mt-2">{address}</p>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
                <p>Click anywhere on the map to update coordinates</p>
            </div>
        </div>
    );
};

export default LeafletMap;