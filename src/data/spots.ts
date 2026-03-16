import { TouristSpot } from "@/types";

export const touristSpots: TouristSpot[] = [
  {
    id: 1,
    name: "Balangay Shrine Museum",
    description:
      "Home to the oldest watercraft ever found in Southeast Asia. The ancient balangay boats, dating back to 320 AD, were discovered in Butuan and are preserved here as a UNESCO heritage treasure.",
    category: "museum",
    coordinates: [8.9489, 125.5318],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Balangay_boats.jpg/640px-Balangay_boats.jpg",
    highlights: ["Ancient balangay boats (320 AD)", "UNESCO heritage site", "Archaeological finds", "Free admission"],
    address: "Libertad, Butuan City, Agusan del Norte",
    hours: "8:00 AM – 5:00 PM (Mon–Sat)",
    bestTime: "Morning",
  },
  {
    id: 2,
    name: "Butuan National Museum",
    description:
      "A regional museum showcasing the rich pre-colonial history of Butuan as the Kingdom of Butuan — one of the earliest polities in the Philippines, with gold artifacts and ancient trade goods.",
    category: "museum",
    coordinates: [8.9503, 125.5387],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Butuan_City_Hall.jpg/640px-Butuan_City_Hall.jpg",
    highlights: ["Gold artifacts", "Pre-colonial history", "Kingdom of Butuan exhibits", "Free admission"],
    address: "J.C. Aquino Avenue, Butuan City, Agusan del Norte",
    hours: "8:00 AM – 5:00 PM (Tue–Sun)",
    bestTime: "Morning",
  },
  {
    id: 3,
    name: "Banza Church Ruins",
    description:
      "The ruins of one of the oldest churches in Mindanao, built by the Augustinian Recollect friars in the 17th century. A haunting and beautiful reminder of colonial history in Butuan.",
    category: "heritage",
    coordinates: [8.9558, 125.5271],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Banza_Church.jpg/640px-Banza_Church.jpg",
    highlights: ["17th-century ruins", "Augustinian architecture", "Historical landmark", "Photography spot"],
    address: "Banza, Butuan City, Agusan del Norte",
    hours: "Open anytime",
    bestTime: "Golden hour",
  },
  {
    id: 4,
    name: "St. Joseph Cathedral",
    description:
      "The main Roman Catholic cathedral of the Diocese of Butuan. An active place of worship and an architectural landmark in the heart of Butuan City.",
    category: "religious",
    coordinates: [8.9478, 125.5437],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Saint_Joseph_Cathedral_Butuan.jpg/640px-Saint_Joseph_Cathedral_Butuan.jpg",
    highlights: ["Diocesan cathedral", "Active parish", "Colonial-era heritage", "City center landmark"],
    address: "Montilla Blvd., Butuan City, Agusan del Norte",
    hours: "6:00 AM – 8:00 PM daily",
    bestTime: "Early morning",
  },
  {
    id: 5,
    name: "Lake Mainit",
    description:
      "The fourth largest lake in the Philippines, straddling Agusan del Norte and Surigao del Norte. A pristine freshwater lake known for the rare Mainit mudfish and breathtaking sunsets.",
    category: "nature",
    coordinates: [9.3333, 125.5167],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Lake_Mainit.jpg/640px-Lake_Mainit.jpg",
    highlights: ["4th largest lake in PH", "Rare Mainit mudfish", "Freshwater fishing", "Scenic sunsets"],
    address: "Jabonga / Kitcharao, Agusan del Norte",
    hours: "Open anytime",
    bestTime: "Sunrise or sunset",
  },
  {
    id: 6,
    name: "Magkahayupan Falls",
    description:
      "Twin waterfalls nestled in the mountains of Butuan's outskirts. A favorite local retreat for nature lovers seeking cool, refreshing waters surrounded by lush greenery.",
    category: "nature",
    coordinates: [8.8854, 125.4721],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Waterfall_Philippines.jpg/640px-Waterfall_Philippines.jpg",
    highlights: ["Twin waterfall formation", "Natural swimming area", "Jungle trekking", "Local eco-tourism"],
    address: "Tiniwisan, Butuan City, Agusan del Norte",
    hours: "6:00 AM – 5:00 PM daily",
    bestTime: "Dry season (Nov–May)",
  },
  {
    id: 7,
    name: "Agusan del Norte Capitol",
    description:
      "The grand provincial capitol building of Agusan del Norte, surrounded by manicured gardens and an iconic freedom park — a popular spot for Butuanons to relax and celebrate local events.",
    category: "heritage",
    coordinates: [8.9485, 125.5415],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Agusan_del_Norte_Capitol.jpg/640px-Agusan_del_Norte_Capitol.jpg",
    highlights: ["Provincial government seat", "Landscaped grounds", "Freedom park", "Public events venue"],
    address: "J.C. Aquino Avenue, Butuan City, Agusan del Norte",
    hours: "8:00 AM – 5:00 PM (Mon–Fri)",
    bestTime: "Weekday morning",
  },
  {
    id: 8,
    name: "Delta Discovery Park",
    description:
      "An 85-hectare eco-adventure park featuring the longest single zipline in Mindanao. A one-stop destination for outdoor thrills including ATV rides, horseback riding, a butterfly sanctuary, and eco-trails with panoramic views of the Butuan landscape.",
    category: "recreation",
    coordinates: [8.9069, 125.5022],
    image: "https://placehold.co/640x300/D4880A/white?text=Delta+Discovery+Park",
    highlights: ["1.3km zipline (longest in Mindanao)", "ATV & horseback riding", "Butterfly sanctuary", "Eco-trails & swimming"],
    address: "Brgy. Bonbon, Butuan City, Agusan del Norte",
    hours: "8:00 AM – 5:00 PM daily",
    bestTime: "Weekday (less crowd)",
  },
  {
    id: 9,
    name: "Bood Promontory Eco-Park",
    description:
      "A historical hilltop overlooking the Masao River, marking where the first Catholic Easter Mass in Mindanao was held on April 8, 1521. Features monuments of Magellan and local rajas, native vegetation, and sweeping views of Butuan City.",
    category: "heritage",
    coordinates: [8.9527, 125.4930],
    image: "https://placehold.co/640x300/8B5E3C/white?text=Bood+Promontory",
    highlights: ["First Easter Mass in Mindanao (1521)", "Magellan & Raja statues", "Ancient Hadyate tree", "Panoramic city views"],
    address: "Brgy. Pinamanculan, Butuan City, Agusan del Norte",
    hours: "7:00 AM – 5:00 PM daily",
    bestTime: "Early morning",
  },
  {
    id: 10,
    name: "Guingona Park",
    description:
      "Butuan's main public plaza and city center gathering place, home to three ancient Acacia trees over 100 years old and the National Shrine of the Philippine Flag in Mindanao — commemorating the first formal raising of the flag on January 17, 1899.",
    category: "heritage",
    coordinates: [8.9476, 125.5431],
    image: "https://placehold.co/640x300/8B5E3C/white?text=Guingona+Park",
    highlights: ["100-year-old Acacia trees", "National Shrine of the PH Flag", "Historic city center", "Open 24/7, free admission"],
    address: "Jose S. Aquino Avenue, Butuan City, Agusan del Norte",
    hours: "Open 24/7",
    bestTime: "Late afternoon",
  },
  {
    id: 11,
    name: "Mt. Mayapay",
    description:
      "A distinctive 675-meter flat-topped mountain that has been a landmark for Butuan City for over a millennium. The rewarding trek offers views of Butuan City, Agusan River, Butuan Bay, and even Camiguin Island on clear days.",
    category: "nature",
    coordinates: [8.92, 125.49],
    image: "https://placehold.co/640x300/2D6A4F/white?text=Mt.+Mayapay",
    highlights: ["675m flat-topped summit", "Views of Butuan Bay & Camiguin", "3-4 hour trek", "Historic 1,000-year landmark"],
    address: "Brgy. Bonbon, Butuan City, Agusan del Norte",
    hours: "6:00 AM – 3:00 PM (start trek by)",
    bestTime: "Dry season (Nov–Apr)",
  },
  {
    id: 12,
    name: "Dagandang Falls",
    description:
      "A scenic two-tiered waterfall system deep in the forest of Barangay Sumile. The falls feature natural swimming pools, rock slides, and a cave formation — an adventurous day-trip for those willing to trek.",
    category: "nature",
    coordinates: [8.8259, 125.6261],
    image: "https://placehold.co/640x300/2D6A4F/white?text=Dagandang+Falls",
    highlights: ["Two-tiered waterfall", "Natural rock slides", "Cave formation", "Pristine forest setting"],
    address: "Brgy. Sumile, Butuan City, Agusan del Norte",
    hours: "6:00 AM – 4:00 PM daily",
    bestTime: "Dry season (Nov–May)",
  },
  {
    id: 13,
    name: "Magellan's Landing Site",
    description:
      "A coastal monument in Barangay Masao marking the historic landing of Ferdinand Magellan in the Philippines on March 17, 1521. Features sculptural monuments, bronze plaques, and commemorates the blood compact between Magellan and Raja Siaiu.",
    category: "heritage",
    coordinates: [8.944, 125.522],
    image: "https://placehold.co/640x300/8B5E3C/white?text=Magellan+Landing+Site",
    highlights: ["Magellan's 1521 landing marker", "Bronze plaques with history", "Coastal monument", "Free admission"],
    address: "Brgy. Masao, Butuan City, Agusan del Norte",
    hours: "Open anytime",
    bestTime: "Afternoon",
  },
  {
    id: 14,
    name: "Macapagal Bridge",
    description:
      "The second-longest bridge in Mindanao at 908 meters, this cable-stayed steel bridge spans the Agusan River and is one of Butuan's most recognizable landmarks. It offers sweeping river views and is especially photogenic at dusk.",
    category: "heritage",
    coordinates: [8.95, 125.51],
    image: "https://placehold.co/640x300/8B5E3C/white?text=Macapagal+Bridge",
    highlights: ["2nd longest bridge in Mindanao", "908-meter cable-stayed span", "Agusan River views", "Iconic sunset photography spot"],
    address: "Mayor Democrito D. Plaza II Ave., Butuan City, Agusan del Norte",
    hours: "Open 24/7",
    bestTime: "Sunset or night",
  },
];

export const categoryColors: Record<TouristSpot["category"], string> = {
  heritage: "#8B5E3C",
  nature: "#2D6A4F",
  religious: "#6B4FA0",
  museum: "#1D6FA4",
  recreation: "#D4880A",
};

export const categoryLabels: Record<TouristSpot["category"], string> = {
  heritage: "Heritage",
  nature: "Nature",
  religious: "Religious",
  museum: "Museum",
  recreation: "Recreation",
};

export const categoryIcons: Record<TouristSpot["category"], string> = {
  heritage: "🏛️",
  nature: "🌿",
  museum: "🏺",
  religious: "⛪",
  recreation: "🎢",
};

export const SPOT_CATEGORIES: TouristSpot["category"][] = [
  "heritage",
  "nature",
  "museum",
  "religious",
  "recreation",
];
