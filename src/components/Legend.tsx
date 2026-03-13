"use client";

import { categoryColors, categoryIcons, categoryLabels, SPOT_CATEGORIES } from "@/data/spots";

export default function Legend() {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Map Legend
      </p>
      <div className="space-y-1.5">
        {SPOT_CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-2.5">
            <div
              className="h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
              style={{ backgroundColor: categoryColors[cat] }}
            />
            <span className="text-xs text-gray-600">
              {categoryIcons[cat]} {categoryLabels[cat]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2.5">
        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-blue-500 shadow-sm ring-2 ring-blue-200" />
        <span className="text-xs text-gray-600">📍 Your location</span>
      </div>
    </div>
  );
}
