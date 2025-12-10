import React, { useState } from "react";
 
interface GPTypeFilterProps {
  tabs?: string[];
  onTabSelect?: (selectedTab: string) => void;
}
 
const HRTypeFilter: React.FC<GPTypeFilterProps> = ({
  tabs = ["All Submissions", "Asset Declaration", "Annual Investment", "Form 12 C"],
  onTabSelect,
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabSelect) onTabSelect(tab);
  };
 
  return (
    <div className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "text-black border-b-2 border-black"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
 
export default HRTypeFilter;
 
 