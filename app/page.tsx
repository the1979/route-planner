'use client'

import { WaypointMenu } from '@/app/components/WaypointMenu'
import MapContainer from '@/app/components/MapContainer'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import * as L from 'leaflet'
import { WaypointMarker } from '@/app/components/WaypointMarker'
import { Route } from '@/app/components/Route'
import { GeoJSON } from 'leaflet'
import * as togpx from 'togpx'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export interface Waypoint {
  label?: string
  lat: number
  lng: number
}

export default function Home() {
  const [ waypoints, setWaypoints ] = useState<Waypoint[]>([])
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

  useEffect(() => {

  }, [mapRef])

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

          { !waypoints.length && (
              <div className="p-5 text-md text-navbar bg-white/90 rounded-md flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} size="lg" className="flex-none mr-3"/>
                <span>Tap anywhere on the map to add your first route marker</span>
              </div>
          )}

          <WaypointMenu waypoints={waypoints} onDelete={(i) => deleteWaypoint(i)} onReorder={reorderWaypoint}/>
        </div>

        <div className="flex-none">
          {
            waypoints.length > 1 &&
            <button className="block w-full p-2 text-text text-center text-lg font-bold bg-primaryOnDark rounded-md appearance-none"
                    onClick={() => onExport()}>
              Download your Route
            </button>
          }
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
