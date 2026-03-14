"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { touristSpots, categoryColors, categoryIcons, categoryLabels, SPOT_CATEGORIES } from "@/data/spots";
import { TouristSpot } from "@/types";
import SpotCard from "@/components/SpotCard";
import SpotDetail from "@/components/SpotDetail";
import TravelPanel from "@/components/TravelPanel";
import { useVisited } from "@/hooks/useVisited";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type FilterCategory = "all" | TouristSpot["category"];
type SortKey = "default" | "name" | "category";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "name", label: "Name A–Z" },
  { key: "category", label: "By category" },
];

const FOOTER_LINKS = ["About Butuan", "Travel Guide", "Contact Us", "Privacy Policy"];

export default function MapPage() {
  const { visited, toggle: toggleVisited } = useVisited();
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [showTravel, setShowTravel] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

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
    if (sortBy === "name") return [...spots].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "category") return [...spots].sort((a, b) => a.category.localeCompare(b.category));
    return spots;
  }, [filter, search, sortBy]);

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
    <div className="flex h-screen flex-col bg-white">

      {/* ── Header ── */}
      <header className="z-10 flex items-center justify-between border-b border-stone-200 bg-white px-5 py-3.5">
        {/* Logo */}
        <Link href="/" className="text-base font-bold text-stone-900 hover:text-stone-700 transition-colors">
          Butuan Tourist Spots
        </Link>

        {/* Center nav tabs */}
        <nav className="hidden items-center gap-6 md:flex">
          {SPOT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(filter === cat ? "all" : cat)}
              className={`text-sm transition-colors ${
                filter === cat
                  ? "font-semibold text-stone-900 underline underline-offset-4 decoration-stone-900/60"
                  : "font-medium text-stone-500 hover:text-stone-800"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleLocate}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              userLocation ? "text-blue-600" : "text-stone-500 hover:text-stone-800"
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
            <span className="hidden sm:inline">{userLocation ? "Located" : "My Location"}</span>
          </button>

          <div className="rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-bold text-white">
            {touristSpots.length} spots
          </div>
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
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                {filteredSpots.length} Destination{filteredSpots.length !== 1 ? "s" : ""}
              </p>

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
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                            sortBy === opt.key
                              ? "bg-stone-900 font-semibold text-white"
                              : "text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          {opt.label}
                          {sortBy === opt.key && (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Visited progress bar */}
          <div className="border-b border-stone-100 px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Explored
              </p>
              <p className="text-[10px] font-bold text-stone-500">
                {visited.size} / {touristSpots.length}
              </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(visited.size / touristSpots.length) * 100}%` }}
              />
            </div>
          </div>

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

          {/* Legend */}
          <div className="border-t border-stone-100 px-4 py-4">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Map Legend
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SPOT_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: categoryColors[cat] }}
                  />
                  <span className="text-xs text-stone-500">{categoryLabels[cat]}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-200" />
                <span className="text-xs text-stone-500">You</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Map ── */}
        <main className="relative flex-1">
          <Map
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            userLocation={userLocation}
            onSpotSelect={handleSpotSelect}
          />

          {showTravel && selectedSpot && userLocation && (
            <TravelPanel
              spot={selectedSpot}
              userLocation={userLocation}
              onClose={() => setShowTravel(false)}
            />
          )}

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
      <footer className="z-10 flex flex-col items-center justify-between gap-3 border-t border-stone-200 bg-white px-6 py-4 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-sm font-bold text-stone-900">Butuan Discovery</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            {FOOTER_LINKS.map((link, i) => (
              <span key={link} className="flex items-center gap-3">
                <span className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer transition-colors">
                  {link}
                </span>
                {i < FOOTER_LINKS.length - 1 && (
                  <span className="text-stone-200 text-xs">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>

        <p className="text-xs text-stone-400">
          © 2024 Butuan Discovery. All rights reserved.
        </p>
      </footer>

      {showDetail && selectedSpot && (
        <SpotDetail
          spot={selectedSpot}
          isVisited={visited.has(selectedSpot.id)}
          onClose={() => setShowDetail(false)}
          onGetDirections={handleGetDirections}
          onToggleVisited={() => toggleVisited(selectedSpot.id)}
        />
      )}
    </div>
  );
}
