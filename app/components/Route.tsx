import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useMap } from '@/app/components/MapContainer'
import * as L from 'leaflet'
import { GeoJsonObject } from 'geojson'
import { GeoJSON, LayerGroup } from 'leaflet'
import {Waypoint} from "@/app/store/waypoint";

export interface RouteProps {
  waypoints: Waypoint[],
}

// The API exposed by the Route component
export interface RouteApi {
  toGeoJSON: LayerGroup['toGeoJSON']
}

/**
 * Renders the supplied waypoints as a GeoJSON layer on the map
 */
export const Route = forwardRef<RouteApi, RouteProps>(function Route({ waypoints }, ref) {
  const map = useMap()
  const geoJSON = useRef<GeoJSON>(L.geoJSON())

  // expose the `toGeoJSON` method so that the parent can export the route
  useImperativeHandle(ref, () => ({
    toGeoJSON: () => geoJSON.current.toGeoJSON()
  }), [])

  useEffect(() => {
    if (!map) return

    geoJSON.current = L.geoJSON(
      [{
        "type": "LineString",
        "coordinates": waypoints.map(wpt => [wpt.lng, wpt.lat])
      }] as unknown as GeoJsonObject,
      {
        style: {
          color: 'var(--theme-ui-colors-secondary)',
          weight: 8
        }
      }
    )

    geoJSON.current.addTo(map)

    return () => {
      geoJSON.current?.removeFrom(map)
    }
  }, [map, waypoints])

  return null
})
