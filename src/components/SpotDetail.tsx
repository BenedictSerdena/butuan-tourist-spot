"use client";

import { useState, useEffect } from "react";
import { TouristSpot } from "@/types";
import { categoryColors, categoryIcons, categoryLabels } from "@/data/spots";
import { getOpenInfo } from "@/utils/openNow";

interface SpotDetailProps {
  spot: TouristSpot;
  isVisited: boolean;
  isInTrip: boolean;
  onClose: () => void;
  onGetDirections: (spot: TouristSpot) => void;
  onToggleVisited: () => void;
  onToggleTrip: () => void;
}

export default function SpotDetail({ spot, isVisited, isInTrip, onClose, onGetDirections, onToggleVisited, onToggleTrip }: SpotDetailProps) {
  const [copied, setCopied] = useState(false);
  const openInfo = getOpenInfo(spot.hours);
  const isOpen = openInfo.status === "open" || openInfo.status === "always";
  const color = categoryColors[spot.category];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleShare() {
    const spotUrl = `${window.location.origin}/spots/${spot.id}`;
    if (navigator.share) {
      await navigator.share({ title: spot.name, text: `Check out ${spot.name} in Butuan City!`, url: spotUrl }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(spotUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <div
        className="relative mx-5 w-full max-w-[360px] overflow-hidden rounded-[28px] bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: "82vh" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="absolute right-12 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
        >
          {copied ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
        </button>

        {/* Hero image */}
        <div className="relative h-48 shrink-0 overflow-hidden">
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/360x192/${color.replace("#", "")}/ffffff?text=${encodeURIComponent(spot.name.split(" ")[0])}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ backgroundColor: color }}>
              {categoryIcons[spot.category]} {categoryLabels[spot.category]}
            </span>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${isOpen ? "bg-emerald-500 text-white" : "bg-black/50 text-white"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-white" : "bg-red-400"}`} />
              {openInfo.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-5 py-4">

            {/* Title & address */}
            <h2 className="text-[18px] font-black leading-tight text-stone-900">{spot.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-400 line-clamp-1">
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {spot.address}
            </p>

            <p className="mt-3 text-[12px] leading-relaxed text-stone-500 line-clamp-2">{spot.description}</p>

            {/* Info chips */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-600">
                🕐 {spot.hours}
              </span>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${spot.admission === "Free" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                🎟 {spot.admission}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                ✨ {spot.bestTime}
              </span>
            </div>

            {/* Highlights */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {spot.highlights.slice(0, 4).map((h, i) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-stone-600"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-4 space-y-2 pb-5">
              {/* Trip + Visited */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onToggleTrip}
                  className={`rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95 ${
                    isInTrip
                      ? "bg-amber-100 text-amber-700"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {isInTrip ? "✓ In Trip" : "+ Trip"}
                </button>
                <button
                  onClick={onToggleVisited}
                  className={`rounded-2xl py-2.5 text-[12px] font-bold transition active:scale-95 ${
                    isVisited
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {isVisited ? "✓ Visited" : "Visited?"}
                </button>
              </div>

              {/* Travel + Maps */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onGetDirections(spot)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[12px] font-bold text-white transition active:scale-95"
                  style={{ backgroundColor: color }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Travel
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${spot.coordinates[0]},${spot.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#4285F4] py-2.5 text-[12px] font-bold text-white transition active:scale-95"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
