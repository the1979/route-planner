import React, { useEffect } from 'react'
import { useMap } from '@/app/components/MapContainer'
import * as L from 'leaflet'

export interface WaypointMarkerProps {
  lat: number
  lng: number
  // the index of the marker's associated waypoint in the array of waypoints
  index: number
  // function to call when the marker's coordinates are changed
  onMove: (lat: number, lng: number) => void
}

/**
 * Renders a marker for a waypoint on the map at the supplied coordinates.
 * Dragging a marker on the map to change coordinates will call the provided `onMove` callback function.
 */
export const WaypointMarker: React.FC<WaypointMarkerProps> = ({ index, lat, lng, onMove}) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const marker = L.marker(
      { lat, lng },
      {
        draggable: true ,
        icon: L.divIcon({
          html: `${index + 1}`,
          className: 'w-[35px] h[35px] bg-navbar rounded-full !flex items-center justify-center text-white text-lg font-bold drop-shadow-md',
          iconSize: [35, 35],
        }),
      }
    ).addTo(map)

    const handleMoveEnd = (e) => {
      onMove(e.target._latlng.lat, e.target._latlng.lng)
    }

    marker.on('moveend', handleMoveEnd)

    return () => {
      marker.off('moveend', handleMoveEnd)
      marker.removeFrom(map)
    }
  }, [index, lat, lng, map, onMove])

  return null
}
