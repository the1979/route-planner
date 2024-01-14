import React, { useState } from 'react'
import { WaypointListItem } from '@/app/components/unused/WaypointListItem'
import { v4 as uuid } from 'uuid'
import { WaypointListDropZone } from '@/app/components/unused/WaypointListDropZone'

export const WaypointList: React.FC = () => {
  const [ dragTargetIndex, setDragTargetIndex ] = useState<number>()

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

  const handleDrag = (i: number | undefined) => {
    setDragTargetIndex(i)
  }

  const handleDrop = (i: number) => {
    console.warn(i)
    setWaypoints(wpts => {
      if (!dragTargetIndex) return wpts

      const currentDragTargetIndex = dragTargetIndex
      setDragTargetIndex(undefined)

      const currentTarget = wpts.find(wpt => wpt.index === currentDragTargetIndex)

      if (!currentTarget) return wpts

      currentTarget.index = i

      const update = wpts.map(wpt => {
        if (wpt.index >= currentDragTargetIndex) {
          console.warn('here')
          wpt.index++
        }

        return wpt
      })
      console.warn(update)
      return update
    })
  }

  return (
    <menu>
      {
        waypoints
          .sort((a,b) => a.index > b.index ? 1 : -1)
          .map(wp => (
            <>
              <WaypointListDropZone index={wp.index} key={`dz-${wp.id}`} onDrop={handleDrop} />
              <WaypointListItem index={wp.index} label={wp.label} key={wp.id} onDrag={handleDrag} />
            </>
        ))
      }
    </menu>
  )
}
