import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export interface WayPointMenuItemProps {
  label?: string
  // the index of the item in the list
  index: number
  // function to call when the item is deleted
  onDelete: (index: number) => void
}

/**
 * An item in the WayPointMenu list
 *
 * TODO: let the user change the waypoint label
 */
export const WayPointMenuItem: React.FC<WayPointMenuItemProps> = ({
  index,
  label = `Waypoint ${index + 1}`,
  onDelete
}) => {

  return (
    <li className="flex items-center py-1 md:py-2 rounded-sm">
      <FontAwesomeIcon icon={faBars} className="drag-handle flex-none text-white/30 hover:text-white/60 p-2 hover:cursor-move" />
      <span className="block appearance-none flex-1 bg-transparent text-white text-lg">
        { label }
      </span>
      <button className="appearance-none p-2 flex-none" onClick={() => onDelete(index)} >
        <FontAwesomeIcon icon={faTrash} className="flex-none text-white/30 hover:text-white/60 cursor-pointer"/>
      </button>
    </li>
  )
}
