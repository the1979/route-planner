'use client'

import {MapContainer} from '@/app/components/MapContainer'
import React, { useCallback, useRef, useState } from 'react'
import { WaypointMarker } from '@/app/components/WaypointMarker'
import { Route, RouteApi } from '@/app/components/Route'
import * as togpx from 'togpx'
import { Waypoint } from '@/app/store/waypoint'
import {SideMenu} from "@/app/components/SideMenu";

const Home: React.FC = () => {
  const [ waypoints, setWaypoints ] = useState<Waypoint[]>([])
  const geoJSON = useRef<RouteApi>()

  /*******************
   State management
   *******************/

  /**
   * Add a waypoint
   *
   * @param waypoint
   */
  const addWaypoint = useCallback((waypoint: Waypoint) => {
    setWaypoints(wpts => [
      ...wpts,
      waypoint
    ])
  }, [])

  /**
   * Move a waypoint to a different index in the array
   *
   * @param from
   * @param to
   */
  const reorderWaypoint = useCallback((from: number, to: number) => {
    setWaypoints(wpts => {
      const updatedWaypoints = [ ...wpts ]
      updatedWaypoints.splice(to, 0, updatedWaypoints.splice(from, 1)[0])
      return updatedWaypoints
    })
  }, [])

  /**
   * Remove a waypoint
   *
   * @param index
   */
  const deleteWaypoint = (index: number) => {
    setWaypoints(wpts => wpts.filter((wpt, i) => i !== index))
  }

  /**
   * Change the coordinates of the waypoint at the given index
   *
   * @param index
   * @param lat
   * @param lng
   */
  const moveWaypoint = useCallback((index: number, lat: number, lng: number) => {
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
  }, [])

  /**************
   Event handlers
   *************/

  /**
   * Download the current GeoJSON route as a GPX file
   */
  const handleExport = () => {
    const a = document.createElement('a')
    a.download = 'route.gpx'
    // `togpx()` does not add the XML declaration tag to the GPX output, so will do so manually
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>'
    // `application/octet-stream` (generic, unknown binary data type) MIME type ensures the browsers don't try to handle the data themselves
    const blob = new Blob([xmlDeclaration + togpx(geoJSON.current.toGeoJSON())], { type: 'application/octet-stream' })
    a.href = URL.createObjectURL(blob)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
    }, 100)
  }

  return (
    <div className="flex h-full relative overflow-hidden">

      <SideMenu waypoints={waypoints} onDelete={deleteWaypoint} onExport={handleExport} onReorder={reorderWaypoint} />

      {/* map */}
      <div className="h-full flex-1 basis-3/4 relative z-0">
        <MapContainer onWaypointAdd={addWaypoint}>
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

export default Home
