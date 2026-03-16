"use client";

import { TouristSpot } from "@/types";
import { categoryColors, categoryIcons, categoryLabels } from "@/data/spots";
import { getOpenInfo } from "@/utils/openNow";

interface SpotCardProps {
  spot: TouristSpot;
  isSelected: boolean;
  isVisited: boolean;
  onClick: (spot: TouristSpot) => void;
}

export default function SpotCard({ spot, isSelected, isVisited, onClick }: SpotCardProps) {
  return (
    <button
      onClick={() => onClick(spot)}
      className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-150 ${
        isSelected
          ? "border border-stone-900 bg-stone-50"
          : "border border-transparent hover:border-stone-200 hover:bg-stone-50"
      }`}
    >
      <div className="relative">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${categoryColors[spot.category]}18` }}
        >
          {categoryIcons[spot.category]}
        </div>
        {isVisited && (
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: categoryColors[spot.category] }}
          >
            {categoryLabels[spot.category]}
          </p>
          {(() => {
            const info = getOpenInfo(spot.hours);
            const isOpen = info.status === "open" || info.status === "always";
            return (
              <span className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${
                isOpen ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-red-500"}`} />
                {info.label}
              </span>
            );
          })()}
        </div>
        <p className="text-sm font-semibold text-stone-900 leading-snug">{spot.name}</p>
        <p className="mt-0.5 text-xs text-stone-400 truncate">
          {spot.address.split(",").slice(0, 2).join(",")}
        </p>
      </div>

      <svg
        className={`h-4 w-4 shrink-0 transition-colors ${
          isSelected ? "text-stone-700" : "text-stone-300"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
