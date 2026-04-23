import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { select } from 'd3-selection';
import 'd3-transition';

const TrailMap = ({ trailData }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize the map only once on mount
        const map = L.map(mapRef.current).setView([37.7749, -122.4194], 13); // Default view set to San Francisco

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Render GeoJSON data
        if (trailData) {
            L.geoJSON(trailData).addTo(map);
        }

        // Cleanup on unmount
        return () => map.remove();
    }, [trailData]); // Rerun effect if trailData changes

    return <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default TrailMap;
