"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";
import { touristSpots, categoryColors, categoryIcons, categoryLabels } from "@/data/spots";
import { getOpenInfo } from "@/utils/openNow";

export default function SpotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const spot = touristSpots.find((s) => s.id === Number(id));
  if (!spot) notFound();

  const [copied, setCopied] = useState(false);
  const color = categoryColors[spot.category];
  const openInfo = getOpenInfo(spot.hours);
  const isOpen = openInfo.status === "open" || openInfo.status === "always";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.coordinates[0]},${spot.coordinates[1]}`;

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({ title: spot.name, text: spot.description.slice(0, 100) + "…", url }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB]">

      {/* Top bar */}
      <nav className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-base font-bold tracking-tight text-stone-900">
          Butuan Tourist Spots
        </Link>
        <Link
          href="/map"
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
        >
          Explore Map
        </Link>
      </nav>

      <main className="mx-auto max-w-2xl px-6 pb-20">

        {/* Back */}
        <Link
          href="/map"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to map
        </Link>

        {/* Hero image */}
        <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-stone-200 sm:h-96">
          <img
            src={spot.image}
            alt={spot.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/800x400/${color.replace("#", "")}/ffffff?text=${encodeURIComponent(spot.name.split(" ")[0])}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category + open badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {categoryIcons[spot.category]} {categoryLabels[spot.category]}
            </span>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isOpen ? "bg-emerald-500 text-white" : "bg-black/50 text-white"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-white" : "bg-red-400"}`} />
              {openInfo.label}
            </span>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">{spot.name}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-stone-400">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {spot.address}
          </div>

          <p className="mt-5 text-base text-stone-600 leading-relaxed">{spot.description}</p>

          {/* Hours + Best time */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Hours</p>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  isOpen ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-red-500"}`} />
                  {openInfo.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-700">{spot.hours}</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1.5">Best Time</p>
              <p className="text-sm font-semibold text-amber-700">{spot.bestTime}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">Highlights</p>
            <div className="grid grid-cols-2 gap-2">
              {spot.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-sm text-stone-600"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates[0]},${spot.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4285F4] py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-[#3367D6]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Get Directions on Google Maps
            </a>
            <Link
              href="/map"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white py-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              View on Interactive Map
            </Link>
          </div>

          {/* Other spots */}
          <div className="mt-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">More Destinations</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {touristSpots
                .filter((s) => s.id !== spot.id && s.category === spot.category)
                .slice(0, 4)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/spots/${s.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 transition-all hover:border-stone-300 hover:shadow-sm"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                      style={{ backgroundColor: `${categoryColors[s.category]}18` }}
                    >
                      {categoryIcons[s.category]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{s.name}</p>
                      <p className="text-xs text-stone-400 truncate">{s.address.split(",")[0]}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-[#F5F0EB] py-7 text-center text-xs text-stone-400">
        <p>Butuan Tourist Spots · Agusan del Norte, Philippines · Built with Next.js &amp; Leaflet</p>
      </footer>
    </div>
  );
}
