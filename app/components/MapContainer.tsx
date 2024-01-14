import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29idXNlIiwiYSI6ImNqdHpra2VncjM1YzA0ZG1zNWV2OGRjMXUifQ.pdY4nvx8DoEH85KUfNGAjQ'

export const MapContext = createContext<L.Map | undefined>(undefined)
export const useMap = () => useContext(MapContext)

export interface MapProps {
  children?: React.ReactNode
}

export const MapContainer = forwardRef<L.Map | undefined, MapProps>(function MapContainer({ children }, ref) {
  const [ mapRef, setMapRef ] = useState<L.Map>()
  const [ mapContext, setMapContext ] = useState<L.Map>()

  useEffect(() => {
    setMapContext(mapRef)
  }, [mapRef])

  // expose the map instance as forwarded ref
  useImperativeHandle(ref, () => mapRef, [mapRef])

  const mapElementRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return

    const map = L.map(element, {
      center: [ -33.92342041437842, 23.436241149902347 ],
      zoom: 13
    })

    L.tileLayer(`https://api.mapbox.com/styles/v1/cobuse/clrd8yyis00a601qqd9p966oo/tiles/512/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, {
      attribution: '&copy; <a href="https://www.mapbox.com/contribute/">Mapbox</a> <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    map.locate()
    map.on('locationfound', e => {
      map.setView(e.latlng, 13)
    })

    setMapRef(map)

  }, [])

  return (
    <MapContext.Provider value={mapContext}>
      <div ref={mapElementRef} className="h-full">
        { children }
      </div>
    </MapContext.Provider>
  )
})
