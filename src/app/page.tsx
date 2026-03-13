"use client";

import Link from "next/link";
import { touristSpots, categoryColors, categoryIcons, categoryLabels, SPOT_CATEGORIES } from "@/data/spots";

const STATS = [
  { value: String(touristSpots.length), label: "Spots to explore" },
  { value: "Free", label: "No sign-up needed" },
  { value: "5", label: "Categories" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F2]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#F0E8DF] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-sm font-black text-white shadow-sm">
              B
            </div>
            <span className="text-sm font-bold text-gray-800 tracking-tight">Butuan Spots</span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-500 sm:flex">
            <span>Heritage</span>
            <span>Nature</span>
            <span>Museums</span>
          </div>
          <Link
            href="/map"
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-500 transition-colors"
          >
            Open Map
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6">

        {/* Hero */}
        <section className="flex flex-col items-center py-16 text-center sm:py-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Agusan del Norte, Philippines 🇵🇭
          </div>

          <h1 className="mb-5 max-w-2xl text-5xl font-black leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Your guide to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Butuan City</span>
              <span
                className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded-sm opacity-40"
                style={{ backgroundColor: "#F59E0B" }}
              />
            </span>
          </h1>

          <p className="mb-8 max-w-lg text-base text-gray-500 leading-relaxed sm:text-lg">
            Discover heritage, nature, and culture — all on one interactive map. No account needed, just explore.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/map"
              className="group flex items-center gap-2.5 rounded-2xl bg-amber-400 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-200 transition-all hover:bg-amber-500 hover:shadow-amber-300 hover:-translate-y-0.5"
            >
              Explore the Map
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#spots"
              className="rounded-2xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse spots ↓
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-8 sm:gap-14">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-gray-900 sm:text-3xl">{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category cards */}
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Explore by type</p>
              <h2 className="mt-1 text-2xl font-black text-gray-900">What are you looking for?</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SPOT_CATEGORIES.map((cat) => {
              const count = touristSpots.filter((s) => s.category === cat).length;
              return (
                <Link
                  key={cat}
                  href="/map"
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${categoryColors[cat]}18` }}
                  >
                    {categoryIcons[cat]}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{categoryLabels[cat]}</p>
                  <p className="text-xs text-gray-400">{count} spot{count !== 1 ? "s" : ""}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured spots */}
        <section id="spots" className="mb-20">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Don&apos;t miss these</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900">Featured destinations</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {touristSpots.slice(0, 6).map((spot) => (
              <Link
                key={spot.id}
                href="/map"
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x160/${categoryColors[spot.category].replace("#", "")}/ffffff?text=${encodeURIComponent(spot.name.split(" ")[0])}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span
                    className="absolute bottom-3 left-3 rounded-lg px-2 py-1 text-[11px] font-bold text-white"
                    style={{ backgroundColor: categoryColors[spot.category] }}
                  >
                    {categoryIcons[spot.category]} {categoryLabels[spot.category]}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 leading-tight">{spot.name}</h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">{spot.address.split(",")[0]}</p>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{spot.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View all {touristSpots.length} spots on the map →
            </Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mb-16 overflow-hidden rounded-3xl bg-amber-400 px-8 py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-100">Ready to go?</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Start your Butuan adventure</h2>
          <p className="mt-3 text-amber-100 text-sm sm:text-base">
            Interactive map · Travel time estimates · 14 destinations
          </p>
          <Link
            href="/map"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-amber-500 shadow-lg transition-all hover:bg-amber-50 hover:shadow-xl"
          >
            Open the Map →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F0E8DF] bg-white py-6 text-center text-xs text-gray-400">
        <p>Butuan Tourist Spots · Agusan del Norte, Philippines · Built with Next.js & Leaflet</p>
      </footer>
    </div>
  );
}
