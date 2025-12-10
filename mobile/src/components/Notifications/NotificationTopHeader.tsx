import { Plus } from 'lucide-react'
import React from 'react'
import { Bell } from "lucide-react"

interface NotificationHeaderProps {
  title: string
  subTitle?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  rightContent?: React.ReactNode
}

const NotificationTopHeader: React.FC<NotificationHeaderProps> = ({
  title,
  subTitle,
  searchQuery,
  onSearchChange,
  onAddClick,
  showAddButton = true,
  addButtonLabel,
  rightContent,
}) => {
  return (
    <div
      className="relative bg-[#2A4FBF] px-6 py-4 flex items-center justify-between rounded-md shadow-md"
      style={{ width: "100%" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 ">
          {/* <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white " /> */}
          <Bell className="w-6 h-6 sm:w-7 sm:h-7" fill="white" stroke="white" />
        </div>
      <h1 className="text-white text-xl font-semibold">
        {title}
        {subTitle && <span className="text-sm font-normal block">{subTitle}</span>}
      </h1>
      {showAddButton && onAddClick && (
        <button
          className="flex items-center gap-2 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          onClick={onAddClick}
        > 
          <Plus className="h-4 w-4" />
          {addButtonLabel || 'New MoC Request'}
        </button>
      )}
    </div>
    </div>
  )
}

export default NotificationTopHeader