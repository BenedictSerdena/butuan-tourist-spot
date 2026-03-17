"use client";

import { useMemo } from "react";
import { TouristSpot } from "@/types";
import { categoryColors, categoryIcons, categoryLabels } from "@/data/spots";

function calcCarMinutes(from: [number, number], to: [number, number]): number {
  const R = 6371;
  const dLat = ((to[0] - from[0]) * Math.PI) / 180;
  const dLon = ((to[1] - from[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from[0] * Math.PI) / 180) *
      Math.cos((to[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const roadKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.35;
  return Math.round((roadKm / 40) * 60);
}

function fmt(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

interface TripPlannerProps {
  spots: TouristSpot[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function TripPlanner({ spots, onRemove, onClear, onClose }: TripPlannerProps) {
  const legs = useMemo(
    () => spots.slice(1).map((spot, i) => calcCarMinutes(spots[i].coordinates, spot.coordinates)),
    [spots]
  );

  const totalMinutes = legs.reduce((sum, m) => sum + m, 0);

  const mapsUrl = useMemo(() => {
    if (spots.length < 2) return null;
    const origin = `${spots[0].coordinates[0]},${spots[0].coordinates[1]}`;
    const destination = `${spots[spots.length - 1].coordinates[0]},${spots[spots.length - 1].coordinates[1]}`;
    const waypoints = spots
      .slice(1, -1)
      .map((s) => `${s.coordinates[0]},${s.coordinates[1]}`)
      .join("|");
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}`;
  }, [spots]);

  return (
    <div className="absolute right-0 top-0 bottom-0 z-[1000] flex w-80 flex-col border-l border-stone-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Trip Planner</p>
          <p className="text-sm font-bold text-stone-900">
            {spots.length} stop{spots.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {spots.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-semibold text-red-400 transition-colors hover:text-red-600"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-colors hover:bg-stone-200"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {spots.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="text-4xl">🗺️</span>
            <p className="text-sm font-semibold text-stone-400">No stops yet</p>
            <p className="max-w-[180px] text-xs text-stone-300">
              Open any spot and tap "Add to Trip" to start planning your day
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {spots.map((spot, i) => (
              <div key={spot.id}>
                {i > 0 && (
                  <div className="flex items-center gap-2 py-1 pl-3.5">
                    <div className="h-5 w-px bg-stone-200" />
                    <span className="text-[10px] font-semibold text-stone-400">
                      🚗 {fmt(legs[i - 1])}
                    </span>
                  </div>
                )}
                <div className="group flex items-center gap-3 rounded-xl p-2.5 hover:bg-stone-50">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: categoryColors[spot.category] }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-bold leading-snug text-stone-800">
                      {spot.name}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {categoryIcons[spot.category]} {categoryLabels[spot.category]}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(spot.id)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-stone-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-400 group-hover:opacity-100"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {spots.length >= 2 && (
        <div className="space-y-3 border-t border-stone-100 p-4">
          <div className="flex items-center justify-between rounded-xl bg-stone-50 px-3.5 py-2.5">
            <span className="text-xs font-semibold text-stone-500">Total drive time</span>
            <span className="text-sm font-black text-stone-900">{fmt(totalMinutes)}</span>
          </div>
          <a
            href={mapsUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285F4] py-3 text-sm font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-[#3367D6] active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Open Route in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
