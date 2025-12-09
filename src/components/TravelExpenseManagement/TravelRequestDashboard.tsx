import React, { useState } from "react";
import TravelBasicTable from "../tables/TravelBasicTable";
import { TRAVEL_EMP_REQ_HEADER_DATA } from "@/utils/data";
import TravelTimelineModal from "./TravelTimelineModal";
import TableFilterHeader from "./TableFilterHeader";
 
interface TravelRequestDashboardProps {
  tableData: any[];
}
 
const STATUS_OPTIONS = [
  "Approved",
  "Pending",
  "Changes Request",
  "Rejected",
  "Processing",
];
 
const TravelRequestDashboard: React.FC<TravelRequestDashboardProps> = ({ tableData }) => {
  const [requestStatus, setRequestStatus] = useState("");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const filteredRequestData = requestStatus
    ? tableData.filter((item) => item.status === requestStatus)
    : tableData;
 
  const handleViewTimeline = (row: any) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
 
  return (
    <div>
      {/* FILTER HEADER */}
      <TableFilterHeader
        title="Claims Review"
        subTitle="Review and take action on requests"
        statusOptions={STATUS_OPTIONS}
        selectedStatus={requestStatus}
        onStatusChange={setRequestStatus}
      />
 
      {/* TABLE SECTION */}
      <div className="mt-2">
        <TravelBasicTable
          headers={TRAVEL_EMP_REQ_HEADER_DATA}
          data={filteredRequestData}
          onView={handleViewTimeline}
          showReview={true}
        />
 
        <TravelTimelineModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedRow}
        />
      </div>
    </div>
  );
};
 
export default TravelRequestDashboard;