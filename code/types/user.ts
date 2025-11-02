import type { GeoLocation } from './geoLocation';

export type User = {
  id: number;
  username: string;
  location?: GeoLocation;
  points?: number;
};
