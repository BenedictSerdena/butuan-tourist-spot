"use client";

import { TouristSpot } from "@/types";

interface TravelInfo {
  distanceKm: number;
  walkMinutes: number;
  jeepneyMinutes: number;
  carMinutes: number;
}

function calcTravel(from: [number, number], to: [number, number]): TravelInfo {
  const R = 6371;
  const dLat = ((to[0] - from[0]) * Math.PI) / 180;
  const dLon = ((to[1] - from[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from[0] * Math.PI) / 180) *
      Math.cos((to[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const straightKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Road distance is roughly 1.35x straight-line in urban PH
  const roadKm = straightKm * 1.35;

  return {
    distanceKm: Math.round(roadKm * 10) / 10,
    walkMinutes: Math.round((roadKm / 5) * 60),       // 5 km/h walking
    jeepneyMinutes: Math.round((roadKm / 20) * 60),   // 20 km/h avg jeepney in city
    carMinutes: Math.round((roadKm / 40) * 60),        // 40 km/h avg car in city
  };
}

function fmt(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

interface TravelPanelProps {
  spot: TouristSpot;
  userLocation: [number, number];
  onClose: () => void;
}

const MODES = [
  { key: "walk", label: "Walk", icon: "🚶" },
  { key: "jeepney", label: "Jeepney", icon: "🚌" },
  { key: "car", label: "Car / Tricycle", icon: "🚗" },
] as const;

export default function TravelPanel({ spot, userLocation, onClose }: TravelPanelProps) {
  const travel = calcTravel(userLocation, spot.coordinates);

  const times: Record<(typeof MODES)[number]["key"], string> = {
    walk: fmt(travel.walkMinutes),
    jeepney: fmt(travel.jeepneyMinutes),
    car: fmt(travel.carMinutes),
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-[1000] w-full max-w-sm -translate-x-1/2 px-4">
      <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-amber-500 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-100">Directions to</p>
            <p className="font-bold text-white truncate">{spot.name}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 rounded-full bg-amber-400/50 p-1.5 text-white hover:bg-amber-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Distance */}
        <div className="border-b border-gray-100 px-4 py-2 text-center">
          <span className="text-xs text-gray-400">Estimated distance: </span>
          <span className="text-sm font-semibold text-gray-700">{travel.distanceKm} km</span>
        </div>

        {/* Travel modes */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 p-1">
          {MODES.map((mode) => (
            <div key={mode.key} className="flex flex-col items-center gap-1 p-3">
              <span className="text-2xl">{mode.icon}</span>
              <span className="text-lg font-bold text-gray-900">{times[mode.key]}</span>
              <span className="text-xs text-gray-400">{mode.label}</span>
            </div>
          ))}
        </div>

        <p className="pb-3 text-center text-xs text-gray-300">Estimates based on your current location</p>
      </div>
    </div>
  );
}
