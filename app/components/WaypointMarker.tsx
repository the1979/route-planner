import React, { useContext, useEffect, useRef } from 'react'
import { MapContext } from '@/app/components/MapContainer'
import * as L from 'leaflet'

export interface WaypointMarkerProps {
  lat: number
  lng: number
  index: number
  onMove: (lat: number, lng: number) => void
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = ({ index, lat, lng, onMove}) => {
  const map = useContext(MapContext)
  const initialised = useRef(false)

  console.log('render')

  useEffect(() => {
    if (!map || initialised.current) return

    const marker = L.marker(
      { lat, lng },
      {
        draggable: true ,
        icon: L.divIcon({
          html: `${index + 1}`,
          className: 'w-[35px] h[35px] bg-navbar rounded-full !flex items-center justify-center text-white text-lg font-bold',
          iconSize: [35, 35],
        }),
      }
    ).addTo(map)

    marker.on('moveend', (e) => {
      onMove(e.target._latlng.lat, e.target._latlng.lng)
    })

    initialised.current = true

    return () => {
      // marker.removeFrom(map)
    }
  }, [index, lat, lng, map, onMove])

  return null
}
