"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useCallback } from "react";
import { touristSpots, categoryColors, categoryLabels } from "@/data/spots";
import { TouristSpot } from "@/types";
import SpotCard from "@/components/SpotCard";
import SpotDetail from "@/components/SpotDetail";
import TravelPanel from "@/components/TravelPanel";
import Legend from "@/components/Legend";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CATEGORIES = ["all", "heritage", "nature", "religious", "museum", "recreation"] as const;
type FilterCategory = (typeof CATEGORIES)[number];

export default function MapPage() {
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [showTravel, setShowTravel] = useState(false);

  const filteredSpots =
    filter === "all"
      ? touristSpots
      : touristSpots.filter((s) => s.category === filter);

  function locateUser(onSuccess: (coords: [number, number]) => void) {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocating(false);
        onSuccess(coords);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  }

  const handleLocate = useCallback(() => {
    if (userLocation) return;
    locateUser(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  function handleSpotSelect(spot: TouristSpot) {
    setSelectedSpot(spot);
    setShowDetail(true);
    setShowTravel(false);
  }

  function handleGetDirections(spot: TouristSpot) {
    setShowDetail(false);
    setSelectedSpot(spot);
    if (!userLocation) {
      locateUser(() => setShowTravel(true));
    } else {
      setShowTravel(true);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold shadow-sm">
              B
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 leading-none">Butuan Tourist Spots</h1>
              <p className="text-xs text-gray-400 mt-0.5">Agusan del Norte, Philippines</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLocate}
            title="Show my location"
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all border ${
              userLocation
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {locating ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <svg className="h-3.5 w-3.5" fill={userLocation ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span>{userLocation ? "Located" : "My Location"}</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {touristSpots.length} spots
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="z-10 flex gap-1.5 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === cat
                ? "text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            style={
              filter === cat
                ? {
                    backgroundColor:
                      cat === "all" ? "#F59E0B" : categoryColors[cat as TouristSpot["category"]],
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
        <aside className="hidden w-72 flex-shrink-0 flex-col bg-white border-r border-gray-100 md:flex">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {filteredSpots.length} destination{filteredSpots.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                isSelected={selectedSpot?.id === spot.id}
                onClick={handleSpotSelect}
              />
            ))}
          </div>
          <div className="border-t border-gray-100 p-3">
            <Legend />
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

          {/* Travel panel */}
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
              <div className="flex gap-3 overflow-x-auto px-3 pb-4 pt-2">
                {filteredSpots.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => handleSpotSelect(spot)}
                    className={`flex-shrink-0 w-44 cursor-pointer rounded-2xl border-2 bg-white p-3 shadow-xl transition-all ${
                      selectedSpot?.id === spot.id
                        ? "border-amber-400 shadow-amber-100"
                        : "border-transparent"
                    }`}
                  >
                    <span
                      className="rounded-lg px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: categoryColors[spot.category] }}
                    >
                      {categoryLabels[spot.category]}
                    </span>
                    <p className="mt-1.5 text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                      {spot.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {showDetail && selectedSpot && (
        <SpotDetail
          spot={selectedSpot}
          onClose={() => setShowDetail(false)}
          onGetDirections={handleGetDirections}
        />
      )}
    </div>
  );
}
