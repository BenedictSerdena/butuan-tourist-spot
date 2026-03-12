"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { touristSpots, categoryColors, categoryLabels } from "@/data/spots";
import { TouristSpot } from "@/types";
import SpotCard from "@/components/SpotCard";
import SpotDetail from "@/components/SpotDetail";
import TravelPanel from "@/components/TravelPanel";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CATEGORIES = ["all", "heritage", "nature", "religious", "museum", "recreation"] as const;
type FilterCategory = (typeof CATEGORIES)[number];

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [detailSpot, setDetailSpot] = useState<TouristSpot | null>(null);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [showTravel, setShowTravel] = useState(false);

  const filteredSpots =
    filter === "all"
      ? touristSpots
      : touristSpots.filter((s) => s.category === filter);

  function handleSpotSelect(spot: TouristSpot) {
    setSelectedSpot(spot);
    setDetailSpot(spot);
    setShowTravel(false);
  }

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  }, []);

  function handleGetDirections(spot: TouristSpot) {
    setDetailSpot(null);
    setSelectedSpot(spot);
    if (!userLocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
          setShowTravel(true);
        },
        () => setLocating(false),
        { timeout: 10000 }
      );
    } else {
      setShowTravel(true);
    }
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleLocate}
            title="Show my location"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              userLocation
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {locating ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="hidden sm:inline">{userLocation ? "Located" : "My Location"}</span>
          </button>
          <span className="hidden sm:inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {touristSpots.length} destinations
          </span>
        </div>
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
            userLocation={userLocation}
            onSpotSelect={handleSpotSelect}
          />

          {/* Travel time panel */}
          {showTravel && selectedSpot && userLocation && (
            <TravelPanel
              spot={selectedSpot}
              userLocation={userLocation}
              onClose={() => setShowTravel(false)}
            />
          )}

          {/* Mobile floating cards */}
          {!showTravel && (
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
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {detailSpot && (
        <SpotDetail
          spot={detailSpot}
          onClose={() => setDetailSpot(null)}
          onGetDirections={handleGetDirections}
        />
      )}
    </div>
  );
}
