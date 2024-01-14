import React, { useCallback } from 'react'
import Sortable from 'sortablejs'
import { WayPointMenuItem } from '@/app/components/WaypointMenuItem'
import { Waypoint } from '@/app/components/Home'

export interface WaypointMenuProps {
  waypoints: Waypoint[]
  onDelete: (index: number) => void
  onReorder: (from: number, to: number) => void
}
export const WaypointMenu: React.FC<WaypointMenuProps> = ({ waypoints, onDelete, onReorder }) => {

  const containerRef = useCallback((container: HTMLMenuElement) => {
    if (!container) return

    const sortable: Sortable = new Sortable(container, {
      animation: 150,
      ghostClass: 'bg-neutral',
      onUpdate: (event) => {
        if (event.oldIndex !== undefined && event.newIndex !== undefined) {
          onReorder(event.oldIndex, event.newIndex)
        }
      }
    })
  }, [onReorder])

  return (
    <menu ref={containerRef}>
      {
        waypoints
          .map((wp, i) => (
            <WayPointMenuItem index={i} label={wp.label} key={`wpmi-${wp.lat}${wp.lng}`} onDelete={onDelete}/>
          ))
      }
    </menu>
  )
}
