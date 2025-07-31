export interface PointDTO {
  latitude: number;
  longitude: number;
}

export interface Region {
  center: PointDTO;
  boundary: PointDTO[];
}

export interface PointOfInterestDTO {
  name: string | null;
  center: PointDTO;
  value: number;
  budgetType: "TIME" | "DISTANCE" | "ENERGY" | "FUEL";
  travelMode: "CAR" | "PEDESTRIAN" | "BUS";
}

export interface ApiResponse {
  requestRegions: { pointOfInterest: PointOfInterestDTO; region: Region }[];
  responseRegion: Region;
}
