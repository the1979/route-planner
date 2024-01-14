import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export interface WaypointListItemProps {
  label?: string
  index: number
  onDrag: (index: number | undefined) => void
}
export const WaypointListItem: React.FC<WaypointListItemProps> = ({
  index,
  label = `Waypoint ${index}`,
  onDrag
}) => {

  const onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    e.dataTransfer.dropEffect = 'move'
    onDrag(index)
  }

  const onDragEnd = () => {
    onDrag(undefined)
  }

  return (
    <li className="flex items-center gap-2 py-3 hover:cursor-move" draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <FontAwesomeIcon icon={faBars} className="flex-none text-white/30" />
      <input value={label} className="block appearance-none flex-1 bg-transparent text-white text-lg" />
      <FontAwesomeIcon icon={faTrash} className="flex-none text-white/30" />
    </li>
  )
}
