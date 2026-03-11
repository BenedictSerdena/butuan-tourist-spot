export interface TouristSpot {
  id: number;
  name: string;
  description: string;
  category: "heritage" | "nature" | "religious" | "museum" | "recreation";
  coordinates: [number, number]; // [lat, lng]
  image: string;
  highlights: string[];
  address: string;
}
