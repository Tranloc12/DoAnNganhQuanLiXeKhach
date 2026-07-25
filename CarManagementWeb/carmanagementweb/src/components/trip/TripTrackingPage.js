import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Apis, {  endpoints } from '../../configs/Apis';
import BusMap from '../../services/BusMap'; // Ensure the path is correct

const TripTrackingPage = () => {
    const { id: tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                // Fetch the trip details using the ID from the URL
                const res = await Apis.get(endpoints.tripDetail(tripId));
                setTrip(res.data);
            } catch (err) {
                console.error("Failed to fetch trip details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (tripId) {
            fetchTripDetails();
        }
    }, [tripId]);

    if (loading) {
        return <div>Loading trip details...</div>;
    }

    if (!trip) {
        return <div>Trip not found.</div>;
    }

    // Extract the busId from the fetched trip data
    const busId = trip.busId; 

    return (
        <div>
            <h2>Trip Details: {trip.routeName}</h2>
            <p>License Plate: {trip.busLicensePlate}</p>
            <h3>Real-time Bus Location</h3>
            
            {/* Render the BusMap component, passing the busId as a prop */}
            {busId && <BusMap busId={busId} />}
        </div>
    );
};

export default TripTrackingPage;