import React, { useState } from 'react'
import clsx from 'clsx'

export interface WaypointListDropZoneProps {
  index: number,
  onDrop: (index: number) => void
}

export const WaypointListDropZone: React.FC<WaypointListDropZoneProps> = ({ index, onDrop }) => {
  const [ active, setActive ] = useState(false)

  const dragEnterHandler = (ev: React.DragEvent) => {
    ev.preventDefault()
    setActive(true)
  }

  const dragLeaveHandler = (ev: React.DragEvent) => {
    ev.preventDefault()
    setActive(false)
  }

  /**
   * Just here to enable as a "drop zone" for the Drag and Drop API
   */
  const dragOverHandler = (ev: React.DragEvent) => {
    ev.preventDefault()
  }

  const dropHandler = (ev: React.DragEvent) => {
    console.warn('dropHandler', index)
    ev.preventDefault()
    onDrop(index)
  }

  return (
    <li className={clsx('h-[4px] block', { '!h-[30px] bg-white/10': active })}
        onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDrop={dropHandler} onDragOver={dragOverHandler} />
  )
}
