import React, { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { Plus } from "lucide-react"
import MocDropdown, {MocFilters} from "@/components/moc/MocDropdown"

interface MocHeaderProps {
  title: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onStationChange?: (station_name: string) => void;
  onTimeChange?: (days: number | null) => void 
  onApplyFilter: (filters: MocFilters) => void;
  mocData: any[];
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  rightContent?: React.ReactNode
}

const LeaveHeader: React.FC<MocHeaderProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onStationChange,
  onTimeChange,
  onAddClick,
  onApplyFilter, 
  mocData,
  showAddButton = true,
  addButtonLabel,
  rightContent,
}) => {


  const [showPopup, setShowPopup] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSearchChange) return
    let value = e.target.value

    // Show popup if trying to exceed 20 characters
    if (value.length > 20) {
      setShowPopup(true)
      value = value.slice(0, 20) // trim to 20 chars
    } else {
      setShowPopup(false)
    }

    onSearchChange(value)
  }

  return (
    <div
      className="relative bg-white rounded-t-lg px-2 pt-3 mb-1 flex items-center justify-between"
      style={{ width: "100%" }}
    >
      <div className="flex items-center gap-4 mb-5">
      <div>
        <h3 className="text-black text-2xl font-bold">{title}</h3>
        {/* <div className="inline-block ">
          <h6 className="text-sm text-gray">Latest MoC submissions and updates</h6>
        </div> */}
      </div>
      {/* <div> 
      <MocDropdown
              onStationSelect={onStationChange}
              onTimeSelect={onTimeChange}
              onApplyFilter={onApplyFilter}
              mocData={mocData}/>
      </div> */}
      </div>
      {/* <button
        className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white px-3 py-2 mr-5 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[#010810]"
        onClick={onAddClick}
      >
        View All
      </button> */}
    </div>
  )
}

export default LeaveHeader
