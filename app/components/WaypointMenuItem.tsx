import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export interface WayPointMenuItemProps {
  label?: string
  index: number
  onDelete: (index: number) => void
}
export const WayPointMenuItem: React.FC<WayPointMenuItemProps> = ({
  index,
  label = `Waypoint ${index + 1}`,
  onDelete
}) => {

  return (
    <li className="flex items-center gap-2 py-3 hover:cursor-move">
      <FontAwesomeIcon icon={faBars} className="flex-none text-white/30" />
      <input readOnly value={label} className="block appearance-none flex-1 bg-transparent text-white text-lg" />
      <FontAwesomeIcon icon={faTrash} className="flex-none text-white/30" onClick={() => onDelete(index)} />
    </li>
  )
}
