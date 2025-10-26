// Environment configuration
// Centralizes environment variable access with proper defaults
// Note: Mapbox token is accessed via server action in lib/mapbox-token.ts

export const env = {
  checkin: {
    radiusMeters: Number(process.env.NEXT_PUBLIC_CHECKIN_RADIUS_METERS) || 5,
    holdSeconds: Number(process.env.NEXT_PUBLIC_CHECKIN_HOLD_SECONDS) || 3,
    maxGpsAccuracyMeters: Number(process.env.NEXT_PUBLIC_MAX_GPS_ACCURACY_METERS) || 15,
    maxSpeedMps: Number(process.env.NEXT_PUBLIC_MAX_SPEED_MPS) || 2.5,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  },
} as const

export type Env = typeof env
