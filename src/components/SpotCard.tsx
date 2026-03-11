"use client";

import { TouristSpot } from "@/types";
import { categoryColors, categoryLabels } from "@/data/spots";

interface SpotCardProps {
  spot: TouristSpot;
  isSelected: boolean;
  onClick: (spot: TouristSpot) => void;
}

export default function SpotCard({ spot, isSelected, onClick }: SpotCardProps) {
  return (
    <div
      onClick={() => onClick(spot)}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-amber-500 bg-amber-50 shadow-md"
          : "border-gray-200 bg-white hover:border-amber-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
          style={{ backgroundColor: categoryColors[spot.category] }}
        />
        <div className="min-w-0 flex-1">
          <span
            className="mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: categoryColors[spot.category] }}
          >
            {categoryLabels[spot.category]}
          </span>
          <h3 className="font-semibold text-gray-900 leading-tight">{spot.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{spot.description}</p>
        </div>
      </div>
    </div>
  );
}
