"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TouristSpot } from "@/types";
import { categoryColors, categoryLabels } from "@/data/spots";

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createColoredIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function FlyToSelected({ spot }: { spot: TouristSpot | null }) {
  const map = useMap();
  useEffect(() => {
    if (spot) {
      map.flyTo(spot.coordinates, 14, { duration: 1.2 });
    }
  }, [spot, map]);
  return null;
}

interface MapProps {
  spots: TouristSpot[];
  selectedSpot: TouristSpot | null;
  onSpotSelect: (spot: TouristSpot) => void;
}

export default function Map({ spots, selectedSpot, onSpotSelect }: MapProps) {
  return (
    <MapContainer
      center={[8.9475, 125.5406]}
      zoom={13}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected spot={selectedSpot} />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={spot.coordinates}
          icon={createColoredIcon(categoryColors[spot.category])}
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
