export interface MortonBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export function decodeMortonCode(
  mortonCode: number,
  level: number = 10
): { latitude: number; longitude: number } {
  const DEGREES_TO_DECI_MICROS = 1e7;
  const FULL_CIRCLE_UNITS = 3600000000;
  const HALF_CIRCLE_UNITS = FULL_CIRCLE_UNITS / 2;
  const QUARTER_CIRCLE_UNITS = FULL_CIRCLE_UNITS / 4;

  const scale0 = 1 << level;
  const scale1 = 1 << (level + 1);
  const validMortonBits = scale0 - 1;

  const deinterlaced = deinterlace(mortonCode);
  const indexLat = (deinterlaced >> 16) & validMortonBits;
  const indexLon = deinterlaced & validMortonBits;

  const latitudeDeciMicroDegrees =
    (indexLat * FULL_CIRCLE_UNITS) / scale1 - QUARTER_CIRCLE_UNITS;
  const longitudeDeciMicroDegrees =
    (indexLon * FULL_CIRCLE_UNITS) / scale0 - HALF_CIRCLE_UNITS;

  console.log(
    `LatDeciMicro: ${latitudeDeciMicroDegrees}, LngDeciMicro: ${longitudeDeciMicroDegrees}`
  );

  const latitude = latitudeDeciMicroDegrees / DEGREES_TO_DECI_MICROS;
  const longitude = longitudeDeciMicroDegrees / DEGREES_TO_DECI_MICROS;

  console.log(`Final: lat=${latitude}, lng=${longitude}`);

  return { latitude, longitude };
}

function deinterlace(value: number): number {
  let mixer = value;

  mixer = reverseSwapAndMask(mixer, 1, 572662306);

  mixer = reverseSwapAndMask(mixer, 2, 202116108);

  mixer = reverseSwapAndMask(mixer, 4, 15728880);

  mixer = reverseSwapAndMask(mixer, 8, 65280);

  return mixer;
}

function reverseSwapAndMask(val: number, shift: number, mask: number): number {
  const changes = ((val >>> shift) ^ val) & mask;
  return val ^ (changes + (changes << shift));
}

export function encodeMortonCode(
  latitude: number,
  longitude: number,
  level: number = 10
): number {
  const DEGREES_TO_DECI_MICROS = 1e7;
  const FULL_CIRCLE_UNITS = 3600000000;
  const HALF_CIRCLE_UNITS = FULL_CIRCLE_UNITS / 2;
  const QUARTER_CIRCLE_UNITS = FULL_CIRCLE_UNITS / 4;

  const scale0 = 1 << level;
  const scale1 = 1 << (level + 1);
  const validMortonBits = scale0 - 1;

  const latitudeDeciMicroDegrees = latitude * DEGREES_TO_DECI_MICROS;
  const longitudeDeciMicroDegrees = longitude * DEGREES_TO_DECI_MICROS;

  const indexLat =
    Math.floor(
      (scale1 * (latitudeDeciMicroDegrees + QUARTER_CIRCLE_UNITS)) /
        FULL_CIRCLE_UNITS
    ) & validMortonBits;
  const indexLon =
    Math.floor(
      (scale0 * (longitudeDeciMicroDegrees + HALF_CIRCLE_UNITS)) /
        FULL_CIRCLE_UNITS
    ) & validMortonBits;

  const mortonCode = interlace((indexLat << 16) + indexLon);
  return mortonCode;
}

function interlace(raw: number): number {
  let mixer = swapAndMask(raw, 8, 65280);

  mixer = swapAndMask(mixer, 4, 15728880);

  mixer = swapAndMask(mixer, 2, 202116108);

  return swapAndMask(mixer, 1, 572662306);
}

function swapAndMask(val: number, shift: number, mask: number): number {
  const changes = ((val >>> shift) ^ val) & mask;
  return val ^ (changes + (changes << shift));
}

export function getBoundsFromMortonTile(
  mortonCode: number,
  level: number
): { west: number; east: number; south: number; north: number } {
  const scale = 1 << level;
  const xOffset = 180;
  const yOffset = 90;

  function deinterleave(n: number): { x: number; y: number } {
    let x = 0,
      y = 0;
    for (let i = 0; i < 16; i++) {
      x |= ((n >> (2 * i)) & 1) << i;
      y |= ((n >> (2 * i + 1)) & 1) << i;
    }
    return { x, y };
  }

  const { x, y } = deinterleave(mortonCode);

  const west = (x / scale) * 360 - xOffset;
  const east = ((x + 1) / scale) * 360 - xOffset;
  const south = (y / scale) * 180 - yOffset;
  const north = ((y + 1) / scale) * 180 - yOffset;

  return { west, east, south, north };
}

export function getOccurrenceColor(
  occurrences: number,
  maxOccurrences: number
): string {
  const ratio = occurrences / maxOccurrences;

  if (ratio <= 0.2) return "#ffffcc";
  if (ratio <= 0.4) return "#c7e9b4";
  if (ratio <= 0.6) return "#7fcdbb";
  if (ratio <= 0.8) return "#41b6c4";
  return "#2c7fb8";
}

export function calculateZoomLevel(bounds: MortonBounds): number {
  const latDiff = bounds.north - bounds.south;
  const lngDiff = bounds.east - bounds.west;

  const latZoom = Math.log2(360 / latDiff);
  const lngZoom = Math.log2(360 / lngDiff);

  return Math.min(latZoom, lngZoom) - 1;
}
