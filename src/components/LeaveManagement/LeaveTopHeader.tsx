import api from '@/api/axiosInstance'
import { Plus, Info } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
 
interface LeaveHeaderProps {
  title: string
  subTitle?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddClick?: () => void
  onInfoClick?: () => void        
  showAddButton?: boolean
  addButtonLabel?: string
}
 
const LeaveTopHeader: React.FC<LeaveHeaderProps> = ({
  title,
  subTitle,
  searchQuery,
  onSearchChange,
  onAddClick,
  onInfoClick,    
  showAddButton,
  addButtonLabel
}) => {
 
  return (
    <div className="relative bg-[#1E6FBF] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4
        flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 rounded-md shadow-md w-full">
 
      {/* LEFT TEXT */}
      <div className="flex-1 min-w-0">
        <h1 className="text-white text-xs sm:text-sm md:text-lg lg:text-2xl font-semibold truncate">
          {title}
        </h1>
        {subTitle && (
          <span className="text-white text-xs sm:text-xs md:text-sm font-normal block truncate">
            {subTitle}
          </span>
        )}
      </div>
 
      {/* BUTTONS ROW */}
      <div className="flex gap-2">
 
        {/* APPLY LEAVE */}
        {showAddButton && onAddClick && (
          <button
            className="flex items-center justify-center gap-1 rounded-md bg-white
              px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-blue-600 shadow-sm
              transition hover:bg-gray-50 focus:outline-none"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4" />
            <span>Apply Leaves</span>
          </button>
        )}
 
        {/* LEAVE INFO (NEW) */}
        {onInfoClick && (
          <button
            className="flex items-center justify-center gap-1 rounded-md bg-white
              px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-blue-600 shadow-sm
              transition hover:bg-gray-50 focus:outline-none"
            onClick={onInfoClick}
          >
            <Info className="h-4 w-4" />
            <span>Leave Info</span>
          </button>
        )}
 
      </div>
    </div>
  )
}
 
export default LeaveTopHeader