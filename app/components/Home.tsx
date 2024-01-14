'use client'

import {WaypointMenu} from '@/app/components/WaypointMenu'
import {MapContainer} from '@/app/components/MapContainer'
import React, { useCallback, useRef, useState } from 'react'
import { WaypointMarker } from '@/app/components/WaypointMarker'
import { Route, RouteApi } from '@/app/components/Route'
import * as togpx from 'togpx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { Waypoint } from '@/app/store/waypoint'

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

  /**************
   Event handlers
   *************/

  /**
   * Download the current GeoJSON route as a GPX file
   */
  const onExport = () => {
    const a = document.createElement('a')
    a.download = 'route.gpx'
    // `togpx()` does not add the XML declaration tag to the GPX output, so will do so manually
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>'
    // `application/octet-stream` (generic, unknown binary data type) MIME type ensures the browsers don't try to handle the data themselves
    const blob = new Blob([xmlDeclaration + togpx(geoJSON.current.toGeoJSON())], { type: 'application/octet-stream' })
    a.href = URL.createObjectURL(blob)
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="flex h-full">

      {/* side menu */}
      <div className="h-full flex flex-col flex-1 basis-1/3 min-w-[280px] max-w-[400px] bg-navbar text-white/95 p-6">
        <div className="flex-none">
          <h1 className="font-bold text-xl mb-4">Route Builder</h1>
          <hr className="bg-white/10 block border-none h-[3px]" />
        </div>
        <div className="flex-1 flex flex-col py-5 overflow-auto">
          <div className="flex-1 basis-1/4"></div>
          <div className="flex-initial my-auto">

            { !waypoints.length && (
              <div className="p-5 text-md text-navbar bg-white/90 rounded-md flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} size="lg" className="flex-none mr-3"/>
                <span>Tap anywhere on the map to add your first route marker</span>
              </div>
            )}

            <WaypointMenu waypoints={waypoints} onDelete={(i) => deleteWaypoint(i)} onReorder={reorderWaypoint}/>

          </div>
          <div className="flex-1 basis-2/3"></div>
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


      {/* map */}
      <div className="h-full flex-1 basis-3/4">
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
