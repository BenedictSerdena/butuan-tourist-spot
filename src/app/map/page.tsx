"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { touristSpots, categoryColors, categoryIcons, categoryLabels, SPOT_CATEGORIES } from "@/data/spots";
import { TouristSpot } from "@/types";
import SpotCard from "@/components/SpotCard";
import SpotDetail from "@/components/SpotDetail";
import TravelPanel from "@/components/TravelPanel";
import TripPlanner from "@/components/TripPlanner";
import { useVisited } from "@/hooks/useVisited";
import { getOpenInfo } from "@/utils/openNow";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type FilterCategory = "all" | TouristSpot["category"];
type SortKey = "default" | "name" | "category" | "nearest";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "name", label: "Name A–Z" },
  { key: "category", label: "By category" },
  { key: "nearest", label: "Nearest first" },
];

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}


export default function MapPage() {
  const { visited, toggle: toggleVisited, reset: resetVisited } = useVisited();

  const handleSuggest = useCallback(() => {
    const unvisited = touristSpots.filter((s) => !visited.has(s.id));
    const pool = unvisited.length > 0 ? unvisited : touristSpots;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    handleSpotSelect(pick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited]);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [showTravel, setShowTravel] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [tripSpots, setTripSpots] = useState<TouristSpot[]>([]);
  const [showTrip, setShowTrip] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  function toggleTrip(spot: TouristSpot) {
    setTripSpots((prev) =>
      prev.some((s) => s.id === spot.id)
        ? prev.filter((s) => s.id !== spot.id)
        : [...prev, spot]
    );
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredSpots = useMemo(() => {
    let spots =
      filter === "all" ? touristSpots : touristSpots.filter((s) => s.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      spots = spots.filter(
        (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
      );
    }
    if (filterOpenNow) spots = spots.filter((s) => getOpenInfo(s.hours).status !== "closed");
    if (sortBy === "name") return [...spots].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "category") return [...spots].sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy === "nearest" && userLocation)
      return [...spots].sort((a, b) => haversineKm(userLocation, a.coordinates) - haversineKm(userLocation, b.coordinates));
    return spots;
  }, [filter, search, sortBy, userLocation, filterOpenNow]);

  const watchIdRef = useRef<number | null>(null);

  function startWatching() {
    if (!navigator.geolocation || watchIdRef.current !== null) return;
    setLocating(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function stopWatching() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setUserLocation(null);
  }

  useEffect(() => () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); }, []);

  const handleLocate = useCallback(() => {
    if (watchIdRef.current !== null) stopWatching();
    else startWatching();
  }, []);

  function handleSpotSelect(spot: TouristSpot) {
    setSelectedSpot(spot);
    setShowDetail(true);
    setShowTravel(false);
  }

  function handleGetDirections(spot: TouristSpot) {
    setShowDetail(false);
    setSelectedSpot(spot);
    if (!userLocation) startWatching();
    setShowTravel(true);
  }

  return (
    <div className="flex h-screen flex-col bg-white">

      {/* ── Header ── */}
      <header className="z-10 flex items-center justify-between border-b border-stone-200 bg-white px-5 py-3.5">
        {/* Logo + back */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800"
            title="Back to home"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <Link href="/" className="text-base font-bold text-stone-900 hover:text-stone-700 transition-colors">
            Butuan Tourist Spots
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTrip((v) => !v)}
            className={`hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all sm:flex ${
              showTrip
                ? "bg-stone-900 text-white"
                : tripSpots.length > 0
                ? "border border-stone-900 text-stone-900 hover:bg-stone-50"
                : "border border-stone-200 text-stone-500 hover:border-stone-300"
            }`}
          >
            🗺️ Trip
            {tripSpots.length > 0 && (
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black ${showTrip ? "bg-white text-stone-900" : "bg-stone-900 text-white"}`}>
                {tripSpots.length}
              </span>
            )}
          </button>
          <button
            onClick={handleLocate}
            title={userLocation ? "Stop tracking" : "Track my location"}
            className={`flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium transition-colors ${
              userLocation ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            }`}
          >
            {locating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <svg
                className="h-4 w-4"
                fill={userLocation ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="hidden sm:inline text-xs">{locating ? "Locating…" : userLocation ? "Tracking" : "My Location"}</span>
          </button>
        </div>
      </header>

      {/* ── Category filter bar ── */}
      <div className="z-10 flex gap-2 overflow-x-auto border-b border-stone-200 bg-stone-50 px-4 py-2.5">
        {/* ALL pill */}
        <button
          onClick={() => setFilter("all")}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-stone-900 text-white"
              : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
          }`}
        >
          ALL
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
              filter === "all" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
            }`}
          >
            {touristSpots.length}
          </span>
        </button>

        {SPOT_CATEGORIES.map((cat) => {
          const count = touristSpots.filter((s) => s.category === cat).length;
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(active ? "all" : cat)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                active
                  ? "text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
              }`}
              style={active ? { backgroundColor: categoryColors[cat] } : {}}
            >
              <span>{categoryIcons[cat]}</span>
              {categoryLabels[cat]}
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-black"
                style={
                  active
                    ? { backgroundColor: "rgba(255,255,255,0.25)", color: "white" }
                    : { backgroundColor: "#f1f5f9", color: "#64748b" }
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="hidden w-72 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">

          {/* Search + result count + sort */}
          <div className="border-b border-stone-100 p-3 space-y-2.5">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search spots..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-9 text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  {filteredSpots.length} Destination{filteredSpots.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => setFilterOpenNow((v) => !v)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                    filterOpenNow
                      ? "bg-emerald-500 text-white"
                      : "border border-stone-200 text-stone-400 hover:border-stone-300"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${filterOpenNow ? "bg-white" : "bg-emerald-400"}`} />
                  Open now
                </button>
              </div>

              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    sortOpen || sortBy !== "default"
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  Sort
                  <svg className={`h-3 w-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-stone-100 bg-white shadow-xl shadow-stone-200">
                    <div className="p-1.5">
                      {SORT_OPTIONS.map((opt) => {
                        const disabled = opt.key === "nearest" && !userLocation;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => { if (!disabled) { setSortBy(opt.key); setSortOpen(false); } }}
                            disabled={disabled}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                              disabled
                                ? "cursor-not-allowed text-stone-300"
                                : sortBy === opt.key
                                ? "bg-stone-900 font-semibold text-white"
                                : "text-stone-700 hover:bg-stone-50"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {disabled && <span className="text-[10px] text-stone-300">Enable location</span>}
                            {!disabled && sortBy === opt.key && (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggest a Spot + Trip Planner */}
          <div className="border-b border-stone-100 px-3 pb-3 flex gap-2">
            <button
              onClick={handleSuggest}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-bold text-amber-700 transition-all hover:bg-amber-100"
            >
              🎲 Suggest
            </button>
            <button
              onClick={() => setShowTrip((v) => !v)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all ${
                showTrip
                  ? "border-emerald-300 bg-emerald-500 text-white"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              🗺️ Trip
              {tripSpots.length > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${showTrip ? "bg-white/30 text-white" : "bg-emerald-100 text-emerald-600"}`}>
                  {tripSpots.length}
                </span>
              )}
            </button>
          </div>

          {/* Visited progress bar */}
          {(() => {
            const allDone = visited.size === touristSpots.length && touristSpots.length > 0;
            return (
              <div className={`border-b px-4 py-3 transition-colors ${allDone ? "border-amber-100 bg-amber-50" : "border-stone-100"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${allDone ? "text-amber-500" : "text-stone-400"}`}>
                    {allDone ? "🎉 All Explored!" : "Explored"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className={`text-[10px] font-bold ${allDone ? "text-amber-600" : "text-stone-500"}`}>
                      {visited.size} / {touristSpots.length}
                    </p>
                    {visited.size > 0 && (
                      <button
                        onClick={resetVisited}
                        className="text-[10px] font-semibold text-stone-300 underline underline-offset-2 hover:text-stone-500 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-amber-400" : "bg-emerald-500"}`}
                    style={{ width: `${(visited.size / touristSpots.length) * 100}%` }}
                  />
                </div>
                {allDone && (
                  <p className="mt-1.5 text-[10px] text-amber-500 font-medium">
                    You've visited every spot in Butuan!
                  </p>
                )}
              </div>
            );
          })()}

          {/* Spot list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {filteredSpots.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <span className="text-3xl">🔍</span>
                <p className="text-sm font-semibold text-stone-400">No spots found</p>
                <p className="text-xs text-stone-300">Try a different keyword</p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-1 text-xs font-semibold text-stone-600 underline underline-offset-2 hover:text-stone-900"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpot?.id === spot.id}
                  isVisited={visited.has(spot.id)}
                  onClick={handleSpotSelect}
                />
              ))
            )}
          </div>

        </aside>

        {/* ── Map ── */}
        <main className="relative flex-1 min-h-0">
          <div className="absolute inset-0">
          <Map
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            userLocation={userLocation}
            tripSpots={tripSpots}
            onSpotSelect={handleSpotSelect}
          />
          </div>

          {showTrip && (
            <TripPlanner
              spots={tripSpots}
              onRemove={(id) => setTripSpots((prev) => prev.filter((s) => s.id !== id))}
              onClear={() => setTripSpots([])}
              onClose={() => setShowTrip(false)}
            />
          )}

          {showTravel && selectedSpot && userLocation && (
            <TravelPanel
              spot={selectedSpot}
              userLocation={userLocation}
              onClose={() => setShowTravel(false)}
            />
          )}

          {/* Legend — floating bottom-right */}
          <div className="absolute bottom-8 right-3 z-[400] hidden md:block">
            <div className="rounded-xl border border-stone-200 bg-white/90 px-3.5 py-3 shadow-md backdrop-blur-sm">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-stone-400">
                Legend
              </p>
              <div className="flex flex-col gap-1.5">
                {SPOT_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                    <span className="text-[11px] text-stone-500">{categoryLabels[cat]}</span>
                  </div>
                ))}
                {userLocation && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-200" />
                    <span className="text-[11px] text-stone-500">You</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: bottom card strip */}
          {!showTravel && (
            <div className="absolute bottom-0 left-0 right-0 md:hidden z-[999]">
              <div className="flex gap-2.5 overflow-x-auto px-3 pb-4 pt-2">
                {filteredSpots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotSelect(spot)}
                    className={`flex shrink-0 w-48 items-center gap-2.5 rounded-xl border bg-white p-3 text-left shadow-lg transition-all ${
                      selectedSpot?.id === spot.id
                        ? "border-stone-900"
                        : "border-stone-200"
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                      style={{ backgroundColor: `${categoryColors[spot.category]}18` }}
                    >
                      {categoryIcons[spot.category]}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: categoryColors[spot.category] }}
                      >
                        {categoryLabels[spot.category]}
                      </p>
                      <p className="text-xs font-semibold text-stone-900 line-clamp-2 leading-snug">
                        {spot.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="z-10 flex items-center justify-between border-t border-stone-200 bg-white px-6 py-3">
        <Link href="/" className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors">
          ← Back to Home
        </Link>
        <p className="text-xs text-stone-400">
          Butuan Tourist Spots · Agusan del Norte, Philippines
        </p>
      </footer>

      {showDetail && selectedSpot && (
        <SpotDetail
          spot={selectedSpot}
          isVisited={visited.has(selectedSpot.id)}
          isInTrip={tripSpots.some((s) => s.id === selectedSpot.id)}
          onClose={() => setShowDetail(false)}
          onGetDirections={handleGetDirections}
          onToggleVisited={() => toggleVisited(selectedSpot.id)}
          onToggleTrip={() => toggleTrip(selectedSpot)}
        />
      )}
    </div>
  );
}
