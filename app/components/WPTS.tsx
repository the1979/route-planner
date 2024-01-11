import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import Sortable from 'sortablejs'
import { WayPointMenuItem } from '@/app/components/WaypointMenuItem'

const WPTS: React.FC = () => {
  const containerRef = useRef<HTMLMenuElement>(null)
  const [ waypoints, setWaypoints ] = useState([
    {
      label: 'Waypoint 1',
      index: 0,
      id: uuid()
    },
    {
      label: 'Waypoint 2',
      index: 1,
      id: uuid()
    },
    {
      label: 'Waypoint 3',
      index: 2,
      id: uuid()
    }
  ])

  const syncState = useCallback((oldIndex: number, newIndex: number) => {

  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const sortable: Sortable = new Sortable(containerRef.current, {
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      onUpdate: (event) => {
        console.warn(event.item, event.oldIndex, event.newIndex)
        // setWaypoints(wpts => wpts.toReversed())
      }
    })
  }, [])

  return (
    <menu ref={containerRef}>
      {
        waypoints
          .map(wp => (
            <WayPointMenuItem index={wp.index} label={wp.label} key={wp.id} />
          ))
      }
    </menu>
  )
}

export default WPTS
