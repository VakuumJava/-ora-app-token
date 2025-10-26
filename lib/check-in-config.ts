import { env } from "./env"

// Check-in configuration from TZ
export const CHECK_IN_CONFIG = {
  RADIUS_METERS: env.checkin.radiusMeters, // 5m radius for check-in
  HOLD_DURATION_MS: env.checkin.holdSeconds * 1000, // 3 second hold timer
  MAX_GPS_ACCURACY_METERS: env.checkin.maxAccuracyMeters, // Maximum GPS accuracy allowed
  MAX_SPEED_MPS: env.checkin.maxSpeedMps, // Maximum speed 2.5 m/s (9 km/h)
  ANTI_TELEPORT_DISTANCE_METERS: 100, // Flag if user moves >100m instantly
} as const
