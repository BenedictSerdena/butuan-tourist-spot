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
  },
  {
    id: 8,
    name: "Tinago Falls",
    description:
      "A hidden waterfall — 'tinago' means 'hidden' in Bisaya — tucked inside a gorge accessible only by descending hundreds of steps. One of the most dramatic natural attractions near Butuan.",
    category: "nature",
    coordinates: [8.1596, 124.2265],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tinago_Falls.jpg/640px-Tinago_Falls.jpg",
    highlights: ["Hidden gorge waterfall", "400+ steps descent", "Crystal clear pool", "Iconic Mindanao landmark"],
    address: "Lanao del Norte (near Butuan region)",
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
