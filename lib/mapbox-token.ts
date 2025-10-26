"use server"

// Server action to fetch Mapbox token
// This approach satisfies deployment requirements by fetching the token server-side
export async function getMapboxToken(): Promise<string> {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
}
