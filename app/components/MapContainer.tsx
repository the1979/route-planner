import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationEvent } from 'leaflet'
import { Waypoint } from '@/app/store/waypoint'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29idXNlIiwiYSI6ImNqdHpra2VncjM1YzA0ZG1zNWV2OGRjMXUifQ.pdY4nvx8DoEH85KUfNGAjQ'

// MapContext will be passed to all of this component's children and contain the current leaflet map instance
export type MapContextType = L.Map | undefined
export const MapContext = createContext<MapContextType>(undefined)
export const useMap = () => useContext(MapContext)

export interface MapProps {
  children?: React.ReactNode
  // function to call when a waypoint is added to the map
  onWaypointAdd: (waypoint: Waypoint) => void
}

/**
 * Wrapper around the Leaflet map:
 *  - initialises leaflet
 *  - attaches events
 *  - stores the leaflet Map instance in MapContext, and provides this context to its children
 */
export const MapContainer: React.FC<MapProps> = ({ children, onWaypointAdd }) => {
  const [ mapContext, setMapContext ] = useState<MapContextType>()

  /**
   * Set the current map view to the user's coordinates (prompts user for permission).
   * Attach click event to add a waypoint to the map.
   */
  useEffect(function addEvents() {
    if (!mapContext) return

    const addWaypoint = (e: LocationEvent) => {
      onWaypointAdd({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      })
    }

    const setView = (e: LocationEvent) => {
      mapContext.setView(e.latlng)
    }

    mapContext.locate()
    mapContext.on('locationfound', setView)
    mapContext.on('click', addWaypoint)

    return () => {
      mapContext.off('locationfound', setView)
      mapContext.off('click', addWaypoint)
    }
  }, [mapContext, onWaypointAdd])

  /**
   * Initialise the map when the target DOM node is available.
   * Add the created Map instance to the `mapContext` state, and thereby to the MapContext provider.
   */
  const mapElementRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return

    const map = L.map(element, {
      center: [ -33.92342041437842, 23.436241149902347 ],
      zoom: 15
    })

    L.tileLayer(`https://api.mapbox.com/styles/v1/cobuse/clrd8yyis00a601qqd9p966oo/tiles/512/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, {
      attribution: '&copy; <a href="https://www.mapbox.com/contribute/">Mapbox</a> <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    setMapContext(map)

  }, [])

  return (
    <MapContext.Provider value={mapContext}>
      <div ref={mapElementRef} className="h-full">
        { children }
      </div>
    </MapContext.Provider>
  )
}
