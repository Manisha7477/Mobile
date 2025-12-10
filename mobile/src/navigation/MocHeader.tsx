import React, { useState } from "react";
import MocDashDropDown from "@/components/moc/MocDashDropDown";
interface MocHeaderProps {
  title: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onStationChange?: (station_name: string) => void;
  onTimeChange?: (days: number | null) => void;
  mocData: any[];
  onAddClick?: () => void;
  showAddButton?: boolean;
  addButtonLabel?: string;
  rightContent?: React.ReactNode;
  hideFilters?: boolean;
}

const MocHeader: React.FC<MocHeaderProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onStationChange,
  onTimeChange,
  onAddClick,
  mocData,
  showAddButton = true,
  addButtonLabel,
  rightContent,
}) => {

  return (
    <div
      className="relative bg-white rounded-t-lg px-2 pt-3 mb-1 flex items-center justify-between overflow-x-auto  hide-scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      style={{ width: "100%" }}
    >
      <div className="flex items-center gap-5 min-w-max">
        <div>
          <h3 className="text-black font-bold 
                 text-md sm:text-sm md:text-sm lg:text-2xl">
            {title}
          </h3>
          <div className="inline-block">
            <h6 className="text-xs sm:text-sm md:text-base text-gray-500">
              Latest MoC submissions and updates
            </h6>
          </div>
        </div>
        <MocDashDropDown
          onStationSelect={onStationChange}
          onTimeSelect={onTimeChange}
          mocData={mocData}
        />
        {rightContent && <div>{rightContent}</div>}
      </div>
      {showAddButton && (
        <button
          className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white px-3 py-2 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={onAddClick}
        >
          {addButtonLabel || "View All"}
        </button>
      )}
    </div>
  );
};

export default MocHeader;
