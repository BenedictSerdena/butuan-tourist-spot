"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { touristSpots, categoryColors, categoryLabels } from "@/data/spots";
import { TouristSpot } from "@/types";
import SpotCard from "@/components/SpotCard";
import SpotDetail from "@/components/SpotDetail";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CATEGORIES = ["all", "heritage", "nature", "religious", "museum", "recreation"] as const;
type FilterCategory = (typeof CATEGORIES)[number];

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [detailSpot, setDetailSpot] = useState<TouristSpot | null>(null);
  const [filter, setFilter] = useState<FilterCategory>("all");

  const filteredSpots =
    filter === "all"
      ? touristSpots
      : touristSpots.filter((s) => s.category === filter);

  function handleSpotSelect(spot: TouristSpot) {
    setSelectedSpot(spot);
    setDetailSpot(spot);
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white text-lg font-bold">
            B
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Butuan Tourist Spots</h1>
            <p className="text-xs text-gray-500">Agusan del Norte, Philippines</p>
          </div>
        </div>
        <span className="hidden sm:inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {touristSpots.length} destinations
        </span>
      </header>

      {/* Category Filter */}
      <div className="z-10 flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === cat
                ? "text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={
              filter === cat
                ? {
                    backgroundColor:
                      cat === "all"
                        ? "#F59E0B"
                        : categoryColors[cat as TouristSpot["category"]],
                  }
                : {}
            }
          >
            {cat === "all" ? "All" : categoryLabels[cat as TouristSpot["category"]]}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-72 flex-shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50 md:flex">
          <div className="p-3 space-y-2">
            <p className="px-1 text-xs text-gray-400 uppercase tracking-widest font-medium">
              {filteredSpots.length} spot{filteredSpots.length !== 1 ? "s" : ""}
            </p>
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                isSelected={selectedSpot?.id === spot.id}
                onClick={handleSpotSelect}
              />
            ))}
          </div>
        </aside>

        {/* Map */}
        <main className="relative flex-1">
          <Map
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            onSpotSelect={handleSpotSelect}
          />

          {/* Mobile floating cards */}
          <div className="absolute bottom-0 left-0 right-0 md:hidden z-[999]">
            <div className="flex gap-3 overflow-x-auto p-3">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => handleSpotSelect(spot)}
                  className={`flex-shrink-0 w-48 cursor-pointer rounded-xl border-2 bg-white p-3 shadow-lg transition-all ${
                    selectedSpot?.id === spot.id ? "border-amber-500" : "border-transparent"
                  }`}
                >
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColors[spot.category] }}
                  >
                    {categoryLabels[spot.category]}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{spot.name}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {detailSpot && (
        <SpotDetail spot={detailSpot} onClose={() => setDetailSpot(null)} />
      )}
    </div>
  );
}
