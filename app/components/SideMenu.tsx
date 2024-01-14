import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import { WaypointMenu, WaypointMenuProps } from '@/app/components/WaypointMenu'
import { Waypoint } from '@/app/store/waypoint'
import {clsx} from "clsx";

export interface SideMenuProps {
  onDelete: WaypointMenuProps['onDelete']
  onExport: () => void
  onReorder: WaypointMenuProps['onReorder']
  waypoints: Waypoint[]
}

export const SideMenu: React.FC<SideMenuProps> = ({ onDelete, onExport, onReorder, waypoints}) => {
  const [ expanded, setExpanded ] = useState(false)

  return (
    <div className={clsx(
      'flex-1 basis-1/3 min-w-[280px] z-10 transition-[bottom] left-0',
      'h-1/2 md:h-full max-w-auto md:max-w-[400px] w-full md:w-auto absolute md:static -bottom-[calc(50%-80px)]',
      { '!bottom-0': expanded }
    )}>
      <div className="h-full w-full flex flex-col bg-navbar text-white/95 p-3 pt-6 md:p-6">
        <button onClick={() => setExpanded(!expanded)}
                className="absolute left-1/2 -translate-x-1/2 -top-6 md:hidden w-12 h-12 rounded-full flex items-center justify-center gap-2 bg-navbar appearance-none">
          <FontAwesomeIcon icon={expanded ? faChevronCircleDown : faChevronCircleUp} size="xl" />
        </button>

        <div className="flex-none">
          <h1 className="font-bold text-xl mb-4 text-center md:text-left">Route Builder</h1>
          <hr className="bg-white/10 block border-none h-[3px]" />
        </div>

        <div className="flex-1 flex flex-col py-5 overflow-auto">
          <div className="flex-1 basis-1/4" />
          <div className="flex-initial my-auto">

            { !waypoints.length && (
              <div className="p-5 text-md text-navbar bg-white/90 rounded-md flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} size="lg" className="flex-none mr-3"/>
                <span>Tap anywhere on the map to add your first route marker</span>
              </div>
            )}

            <WaypointMenu waypoints={waypoints} onDelete={onDelete} onReorder={onReorder}/>

          </div>
          <div className="flex-1 basis-2/3" />
        </div>

        <div className="flex-none">
          {
            waypoints.length > 1 &&
            <button className="block w-full p-2 text-text text-center text-lg font-bold bg-primaryOnDark rounded-md appearance-none"
                    onClick={onExport}>
              Download your Route
            </button>
          }
        </div>
      </div>
    </div>
  )
}
