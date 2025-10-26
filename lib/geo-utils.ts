// Geolocation utilities for check-in system

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Check if user is within radius of spawn point
 */
export function isWithinRadius(
  userLat: number,
  userLon: number,
  pointLat: number,
  pointLon: number,
  radiusMeters: number,
): boolean {
  const distance = calculateDistance(userLat, userLon, pointLat, pointLon)
  return distance <= radiusMeters
}

/**
 * Validate GPS accuracy
 */
export function isAccuracyValid(accuracy: number, maxAccuracy: number): boolean {
  return accuracy <= maxAccuracy
}

/**
 * Calculate speed between two positions
 */
export function calculateSpeed(lat1: number, lon1: number, lat2: number, lon2: number, timeDeltaMs: number): number {
  const distance = calculateDistance(lat1, lon1, lat2, lon2)
  const timeDeltaSeconds = timeDeltaMs / 1000
  return distance / timeDeltaSeconds // meters per second
}
