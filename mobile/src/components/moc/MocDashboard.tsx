import React, { useEffect, useState } from "react";
import BasicTable from "@/components/tables/BasicTable";
import { MOC_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import MocHeader from "@/navigation/MocHeader";
import MocTopHeader from "./MocTopHeader";
import MocTopCards from "./MocTopCards";
import api from "@/api/axiosInstance";
import { MocFilters } from "./MocDropdown";
interface IMOCTableRow {
  slNo: number;
  moc_request_no: string;
  title: string;
  station_name: string;
  created_by: string;
  date: string;
  status: string;
  action: string;
  mocClosure?: string;
}

const MocDashboard = () => {
  const [tableData, setTableData] = useState<IMOCTableRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<MocFilters>({
    created_by: "",
    moc_request_no: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const roleName = parsedUser?.roleName;

  const handleEditDraft = (row: IMOCTableRow) => {
    navigate("/station-operations/moc/request-creation", {
      state: {
        draftData: {
          moc_request_no: row.moc_request_no,
          station_name: row.station_name,
          title: row.title,
          date: row.date,
          status: row.status,
          created_by: row.created_by,
        },
        isDraftEdit: true,
      },
    });
  };

  const getPageTitle = (roleName?: string) => {
    switch (roleName) {
      case "Engineer":
        return "Management of Changes";
      case "SIC":
        return "Reviewer Dashboard";
      case "Head of Operations":
        return "Approver Dashboard";
      default:
        return "Management of Change";
    }
  };

  const getSubTitle = (roleName?: string) => {
    switch (roleName) {
      case "Engineer":
        return "";
      case "SIC":
      case "Head of Operations":
        return "Review and approve Management of Change requests";
      default:
        return "";
    }
  };

  const [pageTitle, setPageTitle] = useState(getPageTitle(roleName));
  const [subTitle, setSubTitle] = useState(getSubTitle(roleName));

  useEffect(() => {
    setPageTitle(getPageTitle(roleName));
    setSubTitle(getSubTitle(roleName));
  }, [roleName]);

  useEffect(() => {
    const fetchMocData = async () => {
      try {
        setLoading(true);
        const userId = parsedUser?.userId;
        const res = await api.get(`/api/MOC/GetByUser/${userId}`);
        const records = res.data?.data?.data || [];
        if (Array.isArray(records)) {
          const formatted = records.map((item: any, idx: number) => ({
            ...item,
            slNo: idx + 1,
            action: "",
            mocClosure: "",
          }));
          setTableData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch MOC table data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMocData();
  }, []);

  const handleClickViewAction = (row: IMOCTableRow) => {
    navigate(`/station-operations/${encodeURIComponent(row.moc_request_no)}`,
      { state: row }
    );
  };

  const filteredData = tableData.filter((row) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      row.moc_request_no.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q) ||
      row.station_name.toLowerCase().includes(q) ||
      row.created_by.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.slNo.toString().includes(q);

    const matchesStation = !selectedStation || row.station_name === selectedStation;

    let matchesDays = true;
    if (selectedDays) {
      const rowDate = new Date(row.date);
      if (!isNaN(rowDate.getTime())) {
        const today = new Date();
        const diffDays = Math.floor(
          (today.getTime() - rowDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        matchesDays = diffDays <= selectedDays;
      }
    }

    let matchesAdvanced = true;
    if (activeFilters.created_by && row.created_by !== activeFilters.created_by) {
      matchesAdvanced = false;
    }
    if (matchesAdvanced && activeFilters.moc_request_no && row.moc_request_no !== activeFilters.moc_request_no) {
      matchesAdvanced = false;
    }
    if (matchesAdvanced && activeFilters.status && row.status !== activeFilters.status) {
      matchesAdvanced = false;
    }
    if (matchesAdvanced && activeFilters.startDate) {
      if (row.date.split("T")[0] < activeFilters.startDate) matchesAdvanced = false;
    }
    if (matchesAdvanced && activeFilters.endDate) {
      if (row.date.split("T")[0] > activeFilters.endDate) matchesAdvanced = false;
    }
    return matchesSearch && matchesStation && matchesDays && matchesAdvanced;
  });

  const currentItems = filteredData.map((item, idx) => ({
    ...item,
    serialNumber: idx + 1,
  }));

  console.log("currentItems", currentItems);
  useEffect(() => {
    const updated = localStorage.getItem("MOC_UPDATED_STATUS");
    if (updated) {
      const { moc_request_no, status } = JSON.parse(updated);
      setTableData(prev =>
        prev.map(item =>
          item.moc_request_no === moc_request_no
            ? { ...item, status }
            : item
        )
      );
      localStorage.removeItem("MOC_UPDATED_STATUS");
    }
  }, []);
  const userId = parsedUser?.userId;
  const getRowStatusAndAction = (
    statusVal: string | undefined,
    reviewerId: string | null | undefined,
    userIdVal: string | undefined
  ) => {
    const isAssignedReviewer = reviewerId && reviewerId === userIdVal;
    if (!isAssignedReviewer) {
      return { reviewEnabled: false, path: "" };
    }
    const normalizedStatus = statusVal?.toLowerCase();
    switch (normalizedStatus) {
      case "pending review":
        return {
          reviewEnabled: true,
          path: "/station-operations/moc/hira-reviewer/:moc_request_no",
        };
      case "pending hira review":
        return {
          reviewEnabled: true,
          path: "/station-operations/moc/hira-reviewer/:moc_request_no",
        };
      case "pending approval":
        return {
          reviewEnabled: true,
          path: "/station-operations/moc/finalReviewer",
        };
      case "approved":
        return {
          reviewEnabled: true,
          path: "/station-operations/moc/approver",
        };
      default:
        return { reviewEnabled: false, path: "" };
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden -ml-2">
      <div className="mb-2 mt-1 ml-1 rounded-md">
        <MocTopHeader
          title={pageTitle}
          subTitle={subTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/station-operations/moc/request-creation")}
          showAddButton={roleName === "Engineer"}
        />
      </div>
      <div className="rounded-md">
        <MocTopCards />
      </div>
      <div className="flex-shrink-0">
        <MocHeader
          title="Recent Requests"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onStationChange={setSelectedStation}
          onTimeChange={setSelectedDays}
          mocData={tableData}
          onAddClick={() => navigate("/station-operations/moc/viewAll")}
        />
      </div>
      <div className="flex-1 overflow-auto hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div>Loading...</div>
          </div>
        ) : (
          <BasicTable
            tableHeader={MOC_HEADER_DATA}
            tableData={currentItems as any}
            handleClickViewAction={handleClickViewAction}
            handleHiraReviewAction={(row) =>
              navigate(
                `/station-operations/moc/HiraReview/${encodeURIComponent(
                  row.moc_request_no
                )}`,
                { state: row }
              )
            }
            handleFinalReviewAction={(row) =>
              navigate(
                `/station-operations/moc/FinalReview/${encodeURIComponent(
                  row.moc_request_no
                )}`,
                { state: row }
              )
            }
            handleApproverReviewAction={(row) =>
              navigate(
                `/station-operations/moc/approver/${encodeURIComponent(
                  row.moc_request_no
                )}`,
                { state: row }
              )
            }
            handleClickEditAction={(row: IMOCTableRow) => handleEditDraft(row)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            showAddButton={false}
          />
        )}
      </div>
    </div>
  );
};

export default MocDashboard;
