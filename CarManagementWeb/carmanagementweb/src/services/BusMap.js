import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BusMap = ({ busId }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Prevent API call if busId is not valid
    if (!busId) {
      console.log("No busId provided, skipping API fetch.");
      return;
    }

    const fetchBusLocation = () => {
      fetch(`http://localhost:8080/CarManagementApp/api/bus-locations/latest/${busId}`)
        .then(response => {
          if (!response.ok) {
            // Throw an error if the status is not 200 OK
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data && data.latitude && data.longitude) {
            setLocation({
              lat: data.latitude,
              lng: data.longitude,
              busInfo: data.busId
            });
          }
        })
        .catch(error => console.error("Failed to fetch bus location:", error));
    };

    // Fetch initially and then every 5 seconds
    fetchBusLocation();
    const intervalId = setInterval(fetchBusLocation, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [busId]);

  const initialPosition = [10.762622, 106.660172]; // Default location

  return (
    <MapContainer 
      center={initialPosition} 
      zoom={13} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <b>License Plate:</b> {location.busInfo.licensePlate}<br />
            <b>Model:</b> {location.busInfo.model}<br />
            <b>Status:</b> {location.busInfo.status}<br />
            <b>Last Updated:</b> {new Date().toLocaleTimeString()}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default BusMap;