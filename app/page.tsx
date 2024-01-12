'use client'

import { WaypointMenu } from '@/app/components/WaypointMenu'
import MapContainer from '@/app/components/MapContainer'
import React, { useCallback, useRef, useState } from 'react'
import * as L from 'leaflet'
import { v4 as uuid } from 'uuid'
import { WaypointMarker } from '@/app/components/WaypointMarker'
import { Route } from '@/app/components/Route'
import { GeoJSON } from 'leaflet'
import * as togpx from 'togpx'

export interface Waypoint {
  label?: string
  lat: number
  lng: number
}

export default function Home() {
  const [ waypoints, setWaypoints ] = useState<Waypoint[]>([
    {
      label: 'Waypoint 1',
      lat: 51.513015907156756,
      lng: -0.09080886840820312,
    },
  ])
  const geoJSON = useRef<React.MutableRefObject<GeoJSON>>()

  const addWaypoint = (waypoint: Waypoint) => {
    setWaypoints(wpts => [
      ...wpts,
      waypoint
    ])
  }

  const reorderWaypoint = (from: number, to: number) => {
    setWaypoints(wpts => {
      const updatedWaypoints = [ ...wpts ]
      updatedWaypoints.splice(to, 0, updatedWaypoints.splice(from, 1)[0])
      return updatedWaypoints
    })
  }

  const deleteWaypoint = (index: number) => {
    setWaypoints(wpts => wpts.filter((wpt, i) => i !== index))
  }

  const moveWaypoint = (index: number, lat: number, lng: number) => {
    setWaypoints(wpts => wpts.map((wpt, i) => {
      if (index === i) {
        return {
          ...wpt,
          lat,
          lng,
        }
      }
      return wpt
    }))
  }

  const mapRef = useCallback((map: L.Map | undefined) => {
    if (!map) return

    map.on('click', (e) => {
      addWaypoint({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      })
    })
  }, [])

  const onExport = () => {
    const a = document.createElement('a')
    a.download = 'route.gpx'
    // `application/octet-stream` (generic, unknown binary data type) MIME type ensures the browser doesn't try to handle the data itself
    const blob = new Blob([togpx(geoJSON.current.current.toGeoJSON())], { type: 'application/octet-stream' })
    a.href = URL.createObjectURL(blob)
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="flex h-full">
      <div className="h-full flex flex-col flex-none w-[400px] bg-navbar text-white/95 p-6">
        <div className="flex-1">
          <h1 className="font-bold text-xl mb-4">Route Builder</h1>
          <hr className="bg-white/10 block border-none h-[3px] mb-20" />

          <WaypointMenu waypoints={waypoints} onDelete={(i) => deleteWaypoint(i)} onReorder={reorderWaypoint}/>
        </div>

        <div className="flex-none">
          <button className="block w-full p-2 text-white/90 text-center text-lg font-bold bg-primaryOnDark rounded-md appearance-none"
                  onClick={() => onExport()}>
            Download your Route
          </button>
        </div>
      </div>
      <div className="h-full flex-1">
        <MapContainer ref={mapRef}>
          { waypoints.map((wpt, i) => (
            <WaypointMarker lat={wpt.lat} lng={wpt.lng} index={i} key={`${i}${wpt.lat}${wpt.lng}`}
                            onMove={(lat, lng) => moveWaypoint(i, lat, lng)} />
          ))}
          <Route waypoints={waypoints} ref={geoJSON} />
        </MapContainer>
      </div>
    </div>
  )
}
