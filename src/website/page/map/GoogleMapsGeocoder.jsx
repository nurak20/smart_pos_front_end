import React, { useState } from 'react';

const OpenStreetMapGeocoder = ({ lat, lng }) => {
  // const [lat, setLat] = useState('');
  // const [lng, setLng] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // const handleLatChange = (e) => setLat(e.target.value);
  // const handleLngChange = (e) => setLng(e.target.value);

  const getAddress = async () => {
    if (!lat || !lng) {
      setError('Please enter both latitude and longitude');
      return;
    }

    setLoading(true);
    setError('');
    setAddress('');
    setAddressDetails(null);

    try {
      // Using OpenStreetMap Nominatim API - completely free with no key required
      // Make sure to add a proper user-agent in production as per Nominatim Usage Policy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YourAppName/1.0' // Replace with your app name in production
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);
        setAddressDetails(data.address);
      } else {
        setError('No address found for these coordinates');
      }
    } catch (err) {
      setError(`Failed to fetch address: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openInOSM = () => {
    if (lat && lng) {
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}`, '_blank');
    }
  };

  const openInGoogleMaps = () => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Address Lookup</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="text"
            value={lat}
            // onChange={handleLatChange}
            placeholder="e.g. 11.938820"
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="text"
            value={lng}
            // onChange={handleLngChange}
            placeholder="e.g. 105.492291"
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={getAddress}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Get Address'}
        </button>

        <button
          onClick={openInOSM}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Open in OpenStreetMap
        </button>

        <button
          onClick={openInGoogleMaps}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          Open in Google Maps
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {address && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Full Address:</h2>
          <p className="p-3 bg-gray-100 rounded mt-2">{address}</p>
        </div>
      )}

      {addressDetails && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Address Details:</h2>
          <div className="p-3 bg-gray-50 rounded mt-2 space-y-1">
            {Object.entries(addressDetails).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-2">
                <span className="font-medium text-gray-700 capitalize">{key}:</span>
                <span className="col-span-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMapGeocoder;