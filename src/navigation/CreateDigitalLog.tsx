import React, { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { Plus } from "lucide-react"

interface CreateDigitalLogProps {
  title: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  rightContent?: React.ReactNode
}

const CreateDigitalLog: React.FC<CreateDigitalLogProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onAddClick,
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
      className="relative bg-white rounded-t-lg px-4 pt-2 pb-2 flex items-center justify-between"
      style={{ width: "100%" }}
    >
      {/* 🔹 Title */}
      <div className="px-4 py-1 relative border-b-0 inline-block text-base font-semibold flex items-center gap-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 text-transparent bg-clip-text">
        {title}
        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 rounded-full"></span>
      </div>

      {/* 🔹 Right Side Actions */}
      {(searchQuery !== undefined &&
        onSearchChange &&
        (showAddButton ? onAddClick !== undefined : true)) ||
      rightContent ? (
        <div className="flex justify-start gap-4 items-center">
          {/* 🔹 Search Input with Word Limit */}
          {searchQuery !== undefined && onSearchChange && (
            <div className="relative">
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Keyword"
                className="w-50 rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-xs placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
              <FaSearch
                className="absolute left-2 top-2.5 text-gray-400 pointer-events-none"
                size={14}
              />

              {/* Popup Message */}
              {showPopup && (
                <div className="absolute top-10 left-0 bg-red-100 text-red-600 px-2 py-1 rounded text-xs shadow-md z-50">
                  Search up to 20 characters only
                </div>
              )}
            </div>
          )}

          {/* 🔹 Add Button */}
          {/* {showAddButton && onAddClick && (
            <button
              className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner shadow-[#010810]"
              onClick={onAddClick}
            >
              {addButtonLabel ? addButtonLabel : <Plus className="h-3 w-3" />}
            </button>
          )} */}

          <button
          className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner shadow-[#010810]">Add
          </button>
          {/* 🔹 Optional Right Content */}
          {rightContent && rightContent}
        </div>
      ) : null}
    </div>
  )
}

export default CreateDigitalLog
