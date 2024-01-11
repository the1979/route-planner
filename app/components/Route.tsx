import { Waypoint } from '@/app/page'
import { useEffect, useRef } from 'react'
import { useMap } from '@/app/components/MapContainer'

export interface RouteProps {
  waypoints: Waypoint[]
}

export const Route: React.FC<RouteProps> = ({ waypoints }) => {
  const map = useMap()
  const geoJSON = useRef(L.geoJSON(undefined, {
    style: {
      color: 'blue',
    }
  }))

  useEffect(() => {
    if (!map || !geoJSON.current) return

    geoJSON.current.addTo(map)
  })

  useEffect(() => {
    geoJSON.setData([{
      "type": "LineString",
      "coordinates": [waypoints.map(wpt => [ wpt.lng, wpt.lat ])]
    }])

  }, [waypoints])

  return null
}
