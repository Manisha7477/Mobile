import React from 'react'
 
interface GatePassTopHeaderProps {
  title: string
  subTitle?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  rightContent?: React.ReactNode
}
 
const GatePassTopHeader2: React.FC<GatePassTopHeaderProps> = ({
  title,
  subTitle,
  // searchQuery,
  // onSearchChange,
  // onAddClick,
  // showAddButton = true,
  // addButtonLabel,
  // rightContent,
}) => {
  return (
    <div
      className="relative bg-[#1E6FBF] px-6 py-3 flex items-center justify-between rounded-md shadow-md"
      style={{ width: "100%" }}
    >
      <h1 className="text-white text-xl font-semibold">
        {title}
        {subTitle && <span className="text-sm font-normal block">{subTitle}</span>}
      </h1>
      {/* {showAddButton && onAddClick && (
        <button
          className="flex items-center gap-1 whitespace-nowrap rounded-md bg-white px-2 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4" />
          {addButtonLabel || 'New MoC Request'}
        </button>
      )} */}
    </div>
  )
}
 
export default GatePassTopHeader2
 
 
 
 
 
 