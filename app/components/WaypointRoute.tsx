import { Waypoint } from '@/app/page'
import React, { useContext, useEffect, useRef } from 'react'
import { MapContext } from '@/app/components/MapContainer'
import * as L from 'leaflet'
import { Polyline } from 'leaflet'

export interface WaypointRouteProps {
  waypoints: Waypoint[]
}

export const WaypointRoute: React.FC<WaypointRouteProps> = ({ waypoints }) => {
  const map = useContext(MapContext)
  const routeRef = useRef<Polyline>(L.polyline(
    waypoints.map(wp => [ wp.lat, wp.lng ]),
    { color: 'red' }
  ))

  useEffect(() => {
    if (!map) return

    routeRef.current?.remove()
    routeRef.current?.setLatLngs(waypoints.map(wp => [ wp.lat, wp.lng ]))
    // todo: don't remove/add every time
    routeRef.current?.addTo(map)
  }, [waypoints, map])

  return null
}
