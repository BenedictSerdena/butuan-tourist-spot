"use client";

import { TouristSpot } from "@/types";
import { categoryColors, categoryIcons, categoryLabels } from "@/data/spots";

interface SpotCardProps {
  spot: TouristSpot;
  isSelected: boolean;
  onClick: (spot: TouristSpot) => void;
}

export default function SpotCard({ spot, isSelected, onClick }: SpotCardProps) {
  return (
    <div
      onClick={() => onClick(spot)}
      className={`group cursor-pointer rounded-xl p-3.5 transition-all duration-150 border-l-4 ${
        isSelected
          ? "bg-amber-50 border-amber-400 shadow-sm"
          : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg shadow-sm"
          style={{ backgroundColor: `${categoryColors[spot.category]}18` }}
        >
          {categoryIcons[spot.category]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wide"
              style={{ backgroundColor: categoryColors[spot.category] }}
            >
              {categoryLabels[spot.category].toUpperCase()}
            </span>
          </div>
          <h3
            className={`text-sm font-bold leading-snug ${
              isSelected ? "text-gray-900" : "text-gray-800"
            }`}
          >
            {spot.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{spot.address.split(",")[0]}</p>
        </div>
      </div>
    </div>
  );
}
