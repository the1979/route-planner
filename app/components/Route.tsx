import { Waypoint } from '@/app/page'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useMap } from '@/app/components/MapContainer'
import * as L from 'leaflet'
import { GeoJsonObject } from 'geojson'
import { GeoJSON } from 'leaflet'

export interface RouteProps {
  waypoints: Waypoint[],
}

export const Route = forwardRef<React.MutableRefObject<GeoJSON>, RouteProps>(function Route({ waypoints }, ref) {
  const map = useMap()
  const geoJSON = useRef<GeoJSON>(L.geoJSON())

  useImperativeHandle(ref, () => geoJSON, [])

  useEffect(() => {
    if (!map) return

    geoJSON.current?.removeFrom(map)

    const data = {
      "type": "Feature",
      "properties": {
        "name": "CX Route",
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [-104.99404, 39.75621]
      }
    }

    geoJSON.current = L.geoJSON(
      [{
        "type": "LineString",
        "coordinates": waypoints.map(wpt => [wpt.lng, wpt.lat])
      }] as unknown as GeoJsonObject,
      {
        style: {
          color: 'blue',
        }
      }
    )

    geoJSON.current.addTo(map)

  }, [map, waypoints])

  return null
})
