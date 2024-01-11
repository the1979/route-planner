'use client'

import { WaypointMenu } from '@/app/components/WaypointMenu'
import MapContainer from '@/app/components/MapContainer'
import { ReducerAction, useCallback, useState } from 'react'
import * as L from 'leaflet'
import { v4 as uuid } from 'uuid'
import { WaypointMarker } from '@/app/components/WaypointMarker'
import { WaypointRoute } from '@/app/components/WaypointRoute'

export interface Waypoint {
  id: string
  label: string
  lat: number
  lng: number
}

export default function Home() {
  const [ waypoints, setWaypoints ] = useState<Waypoint[]>([
    {
      id: uuid(),
      label: 'Waypoint 1',
      lat: 51.513015907156756,
      lng: -0.09080886840820312,
    },
  ])

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
        label: '',
        id: uuid(),
        lat: e.latlng.lat,
        lng: e.latlng.lng
      })
    })
  }, [])

  return (
    <div className="flex h-full">
      <div className="h-full flex flex-col flex-none w-[400px] bg-navbar text-white/95 p-6">
        <div className="flex-1">
          <h1 className="font-bold text-xl mb-4">Route Builder</h1>
          <hr className="bg-white/10 block border-none h-[3px] mb-20" />

          <WaypointMenu waypoints={waypoints} onDelete={deleteWaypoint} onReorder={reorderWaypoint}/>
        </div>

        <div className="flex-none">
          <button>Download</button>
        </div>
      </div>
      <div className="h-full flex-1">
        <MapContainer ref={mapRef}>
          { waypoints.map((wpt, i) => (
            <WaypointMarker lat={wpt.lat} lng={wpt.lng} key={wpt.id} onMove={(lat, lng) => moveWaypoint(i, lat, lng)} />
          ))}
          <WaypointRoute waypoints={waypoints} />
        </MapContainer>
      </div>
    </div>
  )
}
