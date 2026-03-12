"use client";

import { TouristSpot } from "@/types";
import { categoryColors, categoryLabels } from "@/data/spots";

interface SpotDetailProps {
  spot: TouristSpot;
  onClose: () => void;
  onGetDirections: (spot: TouristSpot) => void;
}

export default function SpotDetail({ spot, onClose, onGetDirections }: SpotDetailProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative h-52 overflow-hidden bg-gray-200">
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/640x300/2D6A4F/white?text=Butuan+Tourist+Spot";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: categoryColors[spot.category] }}
            >
              {categoryLabels[spot.category]}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900">{spot.name}</h2>

          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{spot.address}</span>
          </div>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{spot.description}</p>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Highlights</h3>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {spot.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onGetDirections(spot)}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}
