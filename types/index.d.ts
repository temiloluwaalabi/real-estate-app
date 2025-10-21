import { Models } from "react-native-appwrite";

export type Review = Models.Document & {
  name: string;
  avatar: string;
  review: string;
  rating: number;
  property: string;
};

export type Gallery = Models.Document & {
  image: string;
  property: string;
};

export type Agent = Models.Document & {
  name: string;
  email: string;
  avatar: string;
};
export type Property = Models.Document & {
  name: string;
  type: string;
  description: string;
  address: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  facilities: string[];
  image: string;
  geolocation: string;
  gallery: Gallery[];
  agent: Agent;
  reviews: Review[];
};
