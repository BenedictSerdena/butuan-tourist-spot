"use client";

import Link from "next/link";
import { touristSpots, categoryIcons, categoryLabels, SPOT_CATEGORIES } from "@/data/spots";

const STATS = [
  { value: String(touristSpots.length), label: "Tourist Spots" },
  { value: "Free", label: "No sign up needed" },
  { value: String(SPOT_CATEGORIES.length), label: "Categories" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1C1917]">

      {/* Minimal top bar — name only */}
      <nav className="flex items-center justify-between px-6 py-5">
        <span className="text-base font-bold tracking-tight text-stone-900">
          Butuan Tourist Spots
        </span>
        <Link
          href="/map"
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
        >
          Explore Map
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-6">

        {/* Hero */}
        <section className="flex flex-col items-center py-20 text-center sm:py-28">

          {/* Location badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/50 px-4 py-1.5 text-xs text-stone-600">
            <svg className="h-3 w-3 shrink-0 text-stone-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Agusan del Norte, Philippines
          </div>

          {/* Headline */}
          <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-stone-900 sm:text-7xl">
            Discover{" "}
            <em
              className="italic text-stone-800"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Butuan
            </em>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-md text-base text-stone-500 leading-relaxed sm:text-lg">
            Heritage sites, breathtaking nature, and rich culture
            in the ancient Kingdom of Butuan.
          </p>

          {/* Category pills */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {SPOT_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href="/map"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/60 px-4 py-2 text-sm text-stone-700 transition-all hover:border-stone-400 hover:bg-white hover:shadow-sm"
              >
                <span className="text-base leading-none">{categoryIcons[cat]}</span>
                {categoryLabels[cat]}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mb-12 flex items-stretch divide-x divide-stone-300">
            {STATS.map((s) => (
              <div key={s.label} className="px-8 text-center first:pl-0 last:pr-0">
                <p className="text-3xl font-bold text-stone-900">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/map"
            className="group inline-flex items-center gap-2.5 rounded-full bg-stone-900 px-9 py-4 text-sm font-semibold text-white transition-all hover:bg-stone-700 hover:-translate-y-0.5"
          >
            Explore the Map
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </section>

        {/* Divider */}
        <div className="border-t border-stone-200" />

        {/* Featured destinations */}
        <section id="spots" className="py-16 sm:py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-stone-400">
                Curated Selection
              </p>
              <h2 className="text-3xl font-bold text-stone-900">Featured Destinations</h2>
            </div>
            <Link
              href="/map"
              className="text-sm font-semibold text-stone-600 transition-colors hover:text-stone-900"
            >
              View All Spots ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {touristSpots.slice(0, 6).map((spot) => (
              <Link
                key={spot.id}
                href="/map"
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200"
              >
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x176/44403c/ffffff?text=${encodeURIComponent(spot.name.split(" ")[0])}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {categoryIcons[spot.category]} {categoryLabels[spot.category]}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900 leading-snug">{spot.name}</h3>
                  <p className="mt-1 text-xs text-stone-400">{spot.address.split(",")[0]}</p>
                  <p className="mt-2 text-sm text-stone-500 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-700 transition-all hover:border-stone-400 hover:shadow-sm"
            >
              View all {touristSpots.length} spots on the map →
            </Link>
          </div>
        </section>

        {/* Bottom CTA banner */}
        <section className="mb-20 overflow-hidden rounded-3xl bg-stone-900 px-8 py-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Ready to explore?
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start your Butuan adventure
          </h2>
          <p className="mt-3 text-sm text-stone-400 sm:text-base">
            Interactive map · Travel time estimates · {touristSpots.length} destinations
          </p>
          <Link
            href="/map"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-stone-900"
          >
            Open the Map →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-[#F5F0EB] py-7 text-center text-xs text-stone-400">
        <p>Butuan Tourist Spots · Agusan del Norte, Philippines · Built with Next.js &amp; Leaflet</p>
      </footer>
    </div>
  );
}
