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
      className="fixed inset-0 z-[9999] flex items-end sm:items-center sm:justify-center sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet — bottom sheet on mobile, centered modal on sm+ */}
      <div
        className="w-full sm:max-w-md flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Drag handle — mobile only */}
        <div className="flex shrink-0 justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-stone-200" />
        </div>

        {/* Hero image */}
        <div className="relative h-40 shrink-0 overflow-hidden bg-stone-100 sm:h-52">
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/640x300/${categoryColors[spot.category].replace("#", "")}/ffffff?text=${encodeURIComponent(spot.name.split(" ")[0])}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Top-right buttons */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              title={copied ? "Copied!" : "Share"}
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
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category + open badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold text-white shadow-lg"
              style={{ backgroundColor: categoryColors[spot.category] }}
            >
              {categoryIcons[spot.category]} {categoryLabels[spot.category]}
            </span>
            <span className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[10px] font-bold ${isOpen ? "bg-emerald-500 text-white" : "bg-black/50 text-white"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-white" : "bg-red-400"}`} />
              {openInfo.label}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="p-4 sm:p-5">
            <h2 className="text-xl font-black leading-tight text-stone-900">{spot.name}</h2>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-400">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{spot.address}</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-stone-500">{spot.description}</p>

            {/* Info tiles */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="col-span-2 rounded-xl bg-stone-50 px-3 py-2.5">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-stone-400">Hours</p>
                <p className="text-xs font-semibold text-stone-700">{spot.hours}</p>
              </div>
              <div className={`rounded-xl px-3 py-2.5 ${spot.admission === "Free" ? "bg-emerald-50" : "bg-blue-50"}`}>
                <p className={`mb-1 text-[9px] font-bold uppercase tracking-widest ${spot.admission === "Free" ? "text-emerald-400" : "text-blue-400"}`}>
                  Admission
                </p>
                <p className={`text-xs font-bold ${spot.admission === "Free" ? "text-emerald-700" : "text-blue-700"}`}>
                  {spot.admission}
                </p>
              </div>
            </div>
            <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2.5">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-amber-400">Best Time to Visit</p>
              <p className="text-xs font-semibold text-amber-700">{spot.bestTime}</p>
            </div>

            {/* Highlights */}
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Highlights</p>
              <div className="grid grid-cols-2 gap-1.5">
                {spot.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-stone-600"
                    style={{ backgroundColor: `${categoryColors[spot.category]}10` }}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: categoryColors[spot.category] }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 space-y-2 pb-8">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onToggleTrip}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97] ${
                    isInTrip ? "border border-amber-200 bg-amber-50 text-amber-700" : "border border-stone-200 bg-stone-50 text-stone-600"
                  }`}
                >
                  {isInTrip ? "✓ In Trip" : "+ Add Trip"}
                </button>
                <button
                  onClick={onToggleVisited}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97] ${
                    isVisited ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-stone-200 bg-stone-50 text-stone-600"
                  }`}
                >
                  {isVisited ? "✓ Visited" : "Mark Visited"}
                </button>
              </div>
              <button
                onClick={() => onGetDirections(spot)}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: categoryColors[spot.category] }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Travel Time
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${spot.coordinates[0]},${spot.coordinates[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285F4] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3367D6] active:scale-[0.98]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
