import React, {useCallback, useRef} from 'react'
import Sortable from 'sortablejs'
import { WayPointMenuItem } from '@/app/components/WaypointMenuItem'

import {Waypoint} from "@/app/store/waypoint";

export interface WaypointMenuProps {
  waypoints: Waypoint[]
  // function to call when a waypoint is deleted
  onDelete: (index: number) => void
  // function to call when an item is reordered
  onReorder: (from: number, to: number) => void
}

/**
 * Renders the supplied waypoints in a list.
 * Items can be deleted and reordered.
 */
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
            <WayPointMenuItem index={i} label={wp.label} key={`wpmi-${i}${wp.lat}${wp.lng}`} onDelete={onDelete}/>
          ))
      }
    </menu>
  )
}
