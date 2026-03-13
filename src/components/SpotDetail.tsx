"use client";

import { TouristSpot } from "@/types";
import { categoryColors, categoryIcons, categoryLabels } from "@/data/spots";

interface SpotDetailProps {
  spot: TouristSpot;
  onClose: () => void;
  onGetDirections: (spot: TouristSpot) => void;
}

export default function SpotDetail({ spot, onClose, onGetDirections }: SpotDetailProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/640x300/${categoryColors[spot.category].replace("#", "")}/ffffff?text=${encodeURIComponent(spot.name.split(" ")[0])}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Category badge on image */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold text-white shadow-lg"
              style={{ backgroundColor: categoryColors[spot.category] }}
            >
              {categoryIcons[spot.category]} {categoryLabels[spot.category]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-xl font-black text-gray-900 leading-tight">{spot.name}</h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{spot.address}</span>
          </div>

          <p className="mt-3 text-sm text-gray-500 leading-relaxed">{spot.description}</p>

          {/* Highlights */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Highlights
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {spot.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-gray-600"
                  style={{ backgroundColor: `${categoryColors[spot.category]}10` }}
                >
                  <span
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: categoryColors[spot.category] }}
                  />
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onGetDirections(spot)}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{
                backgroundColor: categoryColors[spot.category],
                boxShadow: `0 8px 20px ${categoryColors[spot.category]}40`,
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
