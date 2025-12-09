import React, { useState } from "react";
import TravelTopCards from "./TravelTopCards";
import TravelBasicTable from "../tables/TravelBasicTable";
import { TRAVEL_EMP_HEADER_DATA } from "@/utils/data";
import CreateTravelReq from "./TravelRequisition/CreateTravelReq";
import CreateMealAllowance from "./Mealallowance/CreateMealAllowance";
import TravelExpenseTabs from "./TravelExpenseTabs";
import TableFilterHeader from "./TableFilterHeader";
import TravelTimelineModal from "./TravelTimelineModal";
import TravelRequestDashboard from "./TravelRequestDashboard";
import TETopHeader from "./TETopHeader";
import DailyAllowanceForm from "./DailyAllowance/DailyAllowanceForm";
 
function TravelExpenseDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const roleName = parsedUser?.roleName;
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeForm, setActiveForm] = useState<"travel" | "meal" | "daily" | null>(null);
 
  const tableData = [
    {
      claim_id: "req-001",
      type: "Meal Allowance",
      purpose: "Client Meeting in Delhi",
      submitted_date: "2024-03-10",
      amount: "₹5000",
      current_stage: "Completed",
      status: "Approved",
      amount_disbursed: false,
      employee: "John Doe",
      violations: 0,
    },
    {
      claim_id: "req-002",
      type: "Travel Requisition",
      purpose: "International Conference",
      submitted_date: "2024-03-08",
      amount: "₹3000",
      current_stage: "Supervisor",
      status: "Pending",
      amount_disbursed: true,
      employee: "Jane Smith",
      violations: 2,
    },
    {
      claim_id: "req-003",
      type: "Travel Requisition",
      purpose: "Training Program",
      submitted_date: "2024-03-01",
      amount: "₹2000",
      current_stage: "Finance",
      status: "Changes Request",
      amount_disbursed: false,
      employee: "Alice Johnson",
      violations: 1,
    },
    {
      claim_id: "exp-002",
      type: "Travel Expense",
      purpose: "Client Meeting in Delhi",
      submitted_date: "2024-02-23",
      amount: "₹12000",
      current_stage: "Completed",
      status: "Approved",
      amount_disbursed: true,
      employee: "Bob Brown",
      violations: 0,
    },
     {
    claim_id: "req-004",
    type: "Hotel Stay",
    purpose: "2-Day Onsite Support",
    submitted_date: "2024-02-25",
    amount: "₹7,800",
    current_stage: "HR",
    status: "Rejected",
    amount_disbursed: true,
    employee: "Charlie Davis",
    violations: 3,
 
  },
  {
    claim_id: "req-005",
    type: "Cab Reimbursement",
    purpose: "Local Travel – Mumbai",
    submitted_date: "2024-02-22",
    amount: "₹950",
    current_stage: "Completed",
    status: "Approved",
    amount_disbursed: true,
    employee: "Diana Evans",
    violations: 0,
  },
  {
    claim_id: "req-006",
    type: "Air Travel",
    purpose: "Business Trip – Bangalore",
    submitted_date: "2024-02-20",
    amount: "₹12,500",
    current_stage: "Finance",
    status: "Processing",
    amount_disbursed: true,
    employee: "Frank Green",
    violations: 0,
  },
  {
    claim_id: "req-007",
    type: "Meal Allowance",
    purpose: "Late-night deployment",
    submitted_date: "2024-02-18",
    amount: "₹600",
    current_stage: "Supervisor",
    status: "Pending",
    amount_disbursed: false,
    employee: "Eva Harris",
    violations: 1,
  },
  {
    claim_id: "req-008",
    type: "Travel Requisition",
    purpose: "Team Building Event",
    submitted_date: "2024-02-15",
    amount: "₹4,200",
    current_stage: "Completed",
    status: "Approved",
    amount_disbursed: true,
    employee: "George King",
    violations: 0,
  },
  {
    claim_id: "req-009",
    type: "Cab Reimbursement",
    purpose: "Airport Drop",
    submitted_date: "2024-02-12",
    amount: "₹1,200",
    current_stage: "HR",
    status: "Rejected",
    amount_disbursed: false,
    employee: "Hannah Lee",
    violations: 2,
  },
  {
    claim_id: "req-010",
    type: "Hotel Stay",
    purpose: "Client Demo – Hyderabad",
    submitted_date: "2024-02-08",
    amount: "₹6,400",
    current_stage: "Finance",
    status: "Processing",
    amount_disbursed: false,
    employee: "Ian Miller",
    violations: 0,
  },
  ];
 
  const handleViewTimeline = (row: any) => {
    setSelectedRow(row);
    setIsModalOpen(true);  };
  const STATUS_OPTIONS = [
    "Approved",
    "Pending",
    "Changes Request",
    "Rejected",
    "Processing",
  ];
 
  // Filter data based on selected status
  const filteredData = selectedStatus
    ? tableData.filter((item) => item.status === selectedStatus)
    : tableData;
 
    const openTravelForm = () => {
    setActiveForm("travel");
    setIsModalOpen(true);
  };
 
  const openMealForm = () => {
    setActiveForm("meal");
    setIsModalOpen(true);
  };
 
  const openDailyForm = () => {
    setActiveForm("daily");
    setIsModalOpen(true);
  };
 
 
  return (
    <div >
      <TETopHeader
          title="Travel Expense Management"
          subTitle="Employee Dashboard"
          showButtons={true}
          onTravelRequisitionClick={openTravelForm}
          onMealAllowanceClick={openMealForm}
          onDailyAllowanceClick={openDailyForm}
        />
      <TravelExpenseTabs activeTab={activeTab} onTabChange={setActiveTab} roleName={roleName} />
      {activeTab === "Dashboard" && (
        <>
          <div className="mt-1">
            <TravelTopCards />
          </div>
 
          {/* FILTER SECTION */}
          <TableFilterHeader
            title="Claims History & Status"
            subTitle="View and track all your submitted claims"
            statusOptions={STATUS_OPTIONS}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
 
          {/* TABLE SECTION */}
          <div className="mt-1 ">
            <TravelBasicTable
              headers={TRAVEL_EMP_HEADER_DATA}
              data={filteredData}
              onView={handleViewTimeline}
              showReview={false}
            />
            <TravelTimelineModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={selectedRow}
            />
          </div>
        </>
       )}
     {activeTab === "Requests" && (
        <TravelRequestDashboard tableData={tableData} />
      )}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[96%] max-w-4xl max-h-[92vh] overflow-y-auto p-4">
 
              {activeForm === "travel" && (
                <CreateTravelReq onClose={() => setIsModalOpen(false)} />
              )}
 
              {activeForm === "meal" && (
                <CreateMealAllowance onClose={() => setIsModalOpen(false)} />
              )}
 
              {activeForm === "daily" && (
              <DailyAllowanceForm onClose={() => setIsModalOpen(false)} />
              )}
 
            </div>
          </div>
        )}
 
    </div>
  );
}
 
export default TravelExpenseDashboard;