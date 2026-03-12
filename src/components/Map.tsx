"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TouristSpot } from "@/types";
import { categoryColors, categoryLabels } from "@/data/spots";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createColoredIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 34 : 28;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: ${isSelected ? "4px" : "3px"} solid white;
        box-shadow: 0 2px ${isSelected ? "12px" : "8px"} rgba(0,0,0,${isSelected ? "0.6" : "0.4"});
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size - 4],
  });
}

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 18px; height: 18px;
      background: #3B82F6;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyToSelected({ spot }: { spot: TouristSpot | null }) {
  const map = useMap();
  useEffect(() => {
    if (spot) {
      map.flyTo(spot.coordinates, 15, { duration: 1.2 });
    }
  }, [spot, map]);
  return null;
}

interface MapProps {
  spots: TouristSpot[];
  selectedSpot: TouristSpot | null;
  userLocation: [number, number] | null;
  onSpotSelect: (spot: TouristSpot) => void;
}

export default function Map({ spots, selectedSpot, userLocation, onSpotSelect }: MapProps) {
  const routeLine =
    userLocation && selectedSpot
      ? [userLocation, selectedSpot.coordinates]
      : null;

  return (
    <MapContainer
      center={[8.9475, 125.5406]}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected spot={selectedSpot} />

      {/* User location */}
      {userLocation && (
        <>
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <p className="font-semibold text-blue-600">You are here</p>
            </Popup>
          </Marker>
          <Circle
            center={userLocation}
            radius={80}
            pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.08, weight: 1.5 }}
          />
        </>
      )}

      {/* Route line */}
      {routeLine && (
        <Polyline
          positions={routeLine as [number, number][]}
          pathOptions={{
            color: "#F59E0B",
            weight: 4,
            opacity: 0.85,
            dashArray: "10, 8",
          }}
        />
      )}

      {/* Tourist spot markers */}
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={spot.coordinates}
          icon={createColoredIcon(
            categoryColors[spot.category],
            selectedSpot?.id === spot.id
          )}
          eventHandlers={{ click: () => onSpotSelect(spot) }}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold text-gray-900">{spot.name}</p>
              <p className="text-xs text-gray-500">{categoryLabels[spot.category]}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
