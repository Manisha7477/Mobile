import { ChevronDown } from "lucide-react";
import React from "react";
import { HiFilter } from "react-icons/hi";
import SelectField from "@/components/forms/fields/SelectField";
import { IFormVariable } from "@/utils/types";

interface Props {
  title: string;
  subTitle?: string;
  statusOptions: string[];
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const TableFilterHeader: React.FC<Props> = ({
  title,
  subTitle,
  statusOptions,
  selectedStatus,
  onStatusChange,
}) => {

  // Build the SelectField-compatible variable
  const statusSelectField: IFormVariable = {
    name: "status",
    label: "",
    type: "select",
    placeholder: "All Status",
    options: statusOptions.map((status) => ({
      label: status,
      value: status,
    })),
    onChange: (value: string) => onStatusChange(value),
    value: selectedStatus,
    className: "min-w-[150px] text-xs",
  };

  return (
    <div className="flex items-center justify-left gap-4 mt-1">

      {/* LEFT TEXT */}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subTitle && <p className="text-xs text-gray-500">{subTitle}</p>}
      </div>

      {/* STATUS FILTER USING SelectField */}
      <div className="relative flex items-center gap-2">
        {/* <HiFilter className="w-4 h-4 text-gray-700" /> */}

        <div className="relative">
          <SelectField
            variable={{
              name: "",
              display: "",
              type: "select",
              options: statusOptions.map(s => ({ label: s, value: s }))
            }}
            value={selectedStatus}
            onChange={onStatusChange}
          />
          <ChevronDown className="w-4 h-4 text-gray-800 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TableFilterHeader;
