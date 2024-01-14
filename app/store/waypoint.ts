// The core of application state: a waypoint represents a set of lat/lng coordinates on the map
// and an optional display label
export interface Waypoint {
  label?: string
  lat: number
  lng: number
}
