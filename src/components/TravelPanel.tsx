"use client";

import { useMemo } from "react";
import { TouristSpot } from "@/types";
import { categoryColors, categoryIcons } from "@/data/spots";

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
    walkMinutes: Math.round((roadKm / 5) * 60),
    jeepneyMinutes: Math.round((roadKm / 20) * 60),
    carMinutes: Math.round((roadKm / 40) * 60),
  };
}

function fmt(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

const MODES = [
  { key: "walk", label: "Walk", icon: "🚶" },
  { key: "jeepney", label: "Jeepney", icon: "🚌" },
  { key: "car", label: "Car / Tricycle", icon: "🚗" },
] as const;

interface TravelPanelProps {
  spot: TouristSpot;
  userLocation: [number, number];
  onClose: () => void;
}

export default function TravelPanel({ spot, userLocation, onClose }: TravelPanelProps) {
  const travel = useMemo(
    () => calcTravel(userLocation, spot.coordinates),
    [userLocation, spot.coordinates]
  );

  const times: Record<(typeof MODES)[number]["key"], string> = {
    walk: fmt(travel.walkMinutes),
    jeepney: fmt(travel.jeepneyMinutes),
    car: fmt(travel.carMinutes),
  };

  return (
    <div className="absolute bottom-5 left-1/2 z-[1000] w-full max-w-sm -translate-x-1/2 px-4">
      <div className="overflow-hidden rounded-3xl border border-[#F0E8DF] bg-white shadow-2xl shadow-gray-200">
        {/* Spot header */}
        <div className="flex items-center gap-3 border-b border-[#F0E8DF] bg-[#FFF8F2] px-4 py-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: `${categoryColors[spot.category]}20` }}
          >
            {categoryIcons[spot.category]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Directions to</p>
            <p className="text-sm font-bold text-gray-900 truncate">{spot.name}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Distance badge */}
        <div className="flex justify-center py-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {travel.distanceKm} km away
          </div>
        </div>

        {/* Travel modes */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          {MODES.map((mode) => (
            <div
              key={mode.key}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#F0E8DF] bg-[#FFF8F2] p-3"
            >
              <span className="text-2xl">{mode.icon}</span>
              <span className="text-base font-black text-gray-900">{times[mode.key]}</span>
              <span className="text-[10px] font-medium text-gray-400">{mode.label}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${spot.coordinates[0]},${spot.coordinates[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4285F4] py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-[#3367D6] hover:shadow-blue-300 active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Open in Google Maps
          </a>
        </div>
        <p className="pb-3 text-center text-[10px] text-gray-300">Estimated from your current location</p>
      </div>
    </div>
  );
}
