export interface TouristSpot {
  id: number;
  name: string;
  description: string;
  category: "heritage" | "nature" | "religious" | "museum" | "recreation" | "food";
  coordinates: [number, number]; // [lat, lng]
  image: string;
  highlights: string[];
  address: string;
  hours: string;
  bestTime: string;
  admission: string;
}
