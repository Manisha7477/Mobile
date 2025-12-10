import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  HiArrowSmDown,
  HiArrowSmUp,
  HiExclamation,
  HiEye,
  HiOutlineTrash,
  HiPencil,
} from "react-icons/hi";
import { classNames } from "@/utils/dom";
import { formatDate, formatDateTime } from "@/utils/convert";
import { ITableHeader, ITableData, ITableRow } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axiosInstance";

interface IBasicTableProps<T> {
  tableHeader: ITableHeader[];
  tableData: T[];
  handleClickEditAction?: (row: T) => void;
  handleClickViewAction?: (row: T) => void;
  handleDeleteAction?: (row: T) => void;
  handleClickDownload?: (row: T) => void;
  handleHiraReviewAction?: (row: T) => void;
  handleFinalReviewAction?: (row: T) => void;
  handleApproverReviewAction?: (row: T) => void;
  currentPage: number;
  itemsPerPage: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddButtonClick?: () => void;
  maxHeight?: string;
}
interface MocRowBase {
  moc_request_no: string;
  status?: string;
  hira_reviewer_id?: number;
  sic_id?: number;
  approver_id?: number;
  created_by: string;
}


const BasicTable = <T extends MocRowBase>({
  tableHeader,
  tableData,
  handleClickEditAction,
  handleClickViewAction,
  handleDeleteAction,
  handleClickDownload,
  handleHiraReviewAction,
  handleFinalReviewAction,
  handleApproverReviewAction,
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  showAddButton,
  addButtonLabel,
  onAddButtonClick,
  maxHeight,
}: IBasicTableProps<T>) => {
  // const [data, setData] = useState(tableData);
  const [data, setData] = useState<any[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mocData, setMocData] = useState<any>(null);

  const handleEditClick = async (moc_request_no?: string) => {
    if (!moc_request_no) {
      toast.error("MoC Request Number is missing!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/api/MOC/GetMocRequest`, {
        params: { moc_request_no },
      });

      setMocData(res.data);

      // Encode the request number
      const encodedRequestNo = encodeURIComponent(moc_request_no);

      navigate(`/station-operations/moc/request-creation/${encodedRequestNo}`, {
        state: { mocData: res.data },
      });
    } catch (error) {
      console.error("Error fetching MoC data:", error);
      toast.error("Failed to fetch MoC draft");
    } finally {
      setLoading(false);
    }
  };


  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.userId;
  const username = parsedUser?.username;
  console.log("data", data);

  const handleClosure = (row: any, status: string) => {
    const normalized = status.toLowerCase();

    // ✅ Allow only the creator to open closure creation page
    if (normalized === "approved" && row.created_by === username) {
      navigate(
        `/station-operations/moc/request-closure/creation/${encodeURIComponent(
          row.moc_request_no
        )}`
      );
      return;
    }

    // ✅ Anyone can view closed closure
    if (normalized === "closed") {
      navigate(
        `/station-operations/moc/request-closure/reviewer/${encodeURIComponent(
          row.moc_request_no
        )}`
      );
    }
  };



  const handleClickView = (row: T) => handleClickViewAction?.(row);
  const handleDelete = (row: T) => handleDeleteAction?.(row);
  const handleDownload = (row: T) => handleClickDownload?.(row);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const handleHiraClickReview = (row: T) => {
    console.log("✅ HIRA REVIEW HANDLER FIRED — DIRECT NAVIGATION", row);
    navigate(
      `/station-operations/moc/HiraReview/${encodeURIComponent(
        row.moc_request_no
      )}`,
      { state: row })
  };
  const handleFinalClickReview = (row: T) => {
    console.log("✅ HIRA REVIEW HANDLER FIRED — DIRECT NAVIGATION", row);
    navigate(
      `/station-operations/moc/FinalReview/${encodeURIComponent(
        row.moc_request_no
      )}`,
      { state: row })
  };

  const handleApproverClickReview = (row: T) => {
    console.log("✅ HIRA REVIEW HANDLER FIRED — DIRECT NAVIGATION", row);
    navigate(
      `/station-operations/moc/approver/${encodeURIComponent(
        row.moc_request_no
      )}`,
      { state: row })
  };

  // Helper function to determine review button state
  const getReviewButtonConfig = (rowData: any) => {
    const mocHiraId = rowData.hira_reviewer_id;
    const sic_id = rowData.sic_id;
    const approver_id = rowData.approver_id;
    const status = rowData.status;

    if (userId === mocHiraId && status === "Pending HIRA Review") {
      return {
        isEnabled: true,
        handler: handleHiraClickReview,
        row: rowData
      };
    }

    if (userId === sic_id && status === "Pending Review") {
      return {
        isEnabled: true,
        handler: handleFinalClickReview,
        row: rowData
      };
    }

    if (userId === approver_id && status === "Pending Approval") {
      return {
        isEnabled: true,
        handler: handleApproverClickReview,
        row: rowData
      };
    }

    return {
      isEnabled: false,
      handler: () => { },
      row: rowData
    };
  };


  const columnHelper = createColumnHelper<T>();
  const columns = tableHeader.map((header) =>
    columnHelper.accessor(
      (row) => (row as any)[header.name],
      {
        id: header.name,
        header: () => header.display,
        cell: (info) => {
          const rowData = info.row.original;

          if (info.column.id === "action") {
            const reviewConfig = getReviewButtonConfig(rowData);

            return (
              <div className="flex justify-center gap-1 text-gray-600">
                <HiEye
                  onClick={() => handleClickView(rowData)}
                  className="cursor-pointer text-tableHeaderbg hover:text-secondary transition w-5 h-5"
                />View

                <button
                  disabled={!reviewConfig.isEnabled}
                  onClick={() => {
                    console.log("REVIEW BUTTON CLICKED ✅", reviewConfig);
                    reviewConfig.handler(reviewConfig.row);
                  }}
                  className={`text-sm font-semibold px-1 py-0.5 rounded-md shadow-md transition
    ${reviewConfig.isEnabled
                      ? "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                >
                  Review
                </button>

              </div>
            );
          }
          if (info.column.id === "status") {
            const rowData = info.row.original;

            if (rowData.status === "Draft") {
              return (
                <div className="flex items-center gap-1">
                  <span>{rowData.status}</span>

                  {/* ✅ show pencil only if logged-in user = created_by */}
                  {rowData.created_by === username && (
                    <HiPencil
                      className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-600"
                      title="Edit Draft"
                      onClick={() => handleEditClick(rowData.moc_request_no)}
                    />
                  )}
                </div>
              );
            }

            return rowData.status || "Unknown";
          }
          if (info.column.id === "mocClosure") {
            const statusCell = info.row.getAllCells().find((cell) => cell.column.id === "status");
            const statusVal = (statusCell?.getValue() as string) || "";
            const normalizedStatus = statusVal.toLowerCase();

            const isApprovedForCreator =
              normalizedStatus === "approved" && rowData.created_by === username;

            const isClosedStatus = normalizedStatus === "closed";

            const canClick = isApprovedForCreator || isClosedStatus;

            return (
              <div className="flex justify-start">
                <button
                  onClick={() => handleClosure(rowData, normalizedStatus)}
                  className={`px-2 py-0.5 rounded transition text-sm font-medium 
          ${canClick
                      ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  disabled={!canClick}
                >
                  MOC Closure
                </button>
              </div>
            );
          }
          if (info.column.id === "delete") {
            return (
              <div className="flex justify-center text-red-600">
                <HiOutlineTrash
                  onClick={() => handleDelete(rowData)}
                  className="cursor-pointer hover:text-error transition w-5 h-5"
                  title="Delete"
                />
              </div>
            );
          }

          if (info.column.id === "Download") {
            return (
              <div className="flex justify-center">
                <FaDownload
                  onClick={() => handleDownload(rowData)}
                  className="cursor-pointer hover:text-primary transition w-5 h-5"
                  title="Download"
                />
              </div>
            );
          }

          if (info.column.id === "alarm" && info.getValue()) {
            return (
              <div className="flex justify-center text-red-600">
                <HiExclamation className="w-5 h-5" title="Alarm" />
              </div>
            );
          }

          const dateTimeColumns = [
            "CreationDate",
            "LastModifiedDate",
            "PackingDate",
            "PickingDate",
            "DispatchDate",
            "OrderDate",
            "ActualDeliveryDate",
            "ExpectedDeliveryDate",
            "MovementDate",
            "EntryDate",
            "InEntyDate",
            "OutEntyDate",
            "PlannedStartDate",
            "PlannedEndDate",
            "ActualStartDate",
            "ActualEndDate",
            "Cycle_Start",
            "Cycle_End",
          ];
          const dateColumns = ["ValidFrom", "ValidTo"];

          if (dateTimeColumns.includes(info.column.id)) {
            return (
              <span className="whitespace-nowrap text-gray-700 text-sm">
                {formatDateTime(info.renderValue() as string)}
              </span>
            );
          }

          if (dateColumns.includes(info.column.id)) {
            return (
              <span className="whitespace-nowrap text-gray-700 text-sm">
                {formatDate(info.renderValue() as string)}
              </span>
            );
          }

          if (info.column.id === "status") {
            const statusValue = (info.renderValue() as string)?.toLowerCase();
            let textColor = "text-gray-800";
            if (statusValue === "approved") textColor = "text-green-600";
            else if (statusValue === "pending hira review") textColor = "text-gray-600";
            else if (statusValue === "pending review") textColor = "text-blue-600";
            else if (statusValue === "pending approval") textColor = "text-green-600";
            else if (statusValue === "save draft") textColor = "text-gray-600";
            else if (statusValue === "changes requested") textColor = "text-red-600";
            else if (statusValue === "rejected") textColor = "text-red-600";

            return (
              <span className={`text-sm font-medium ${textColor}`}>
                {info.renderValue() as string}
              </span>
            );
          }

          return <span>{info.renderValue() as string}</span>;
        },
        footer: (info) => info.column.id,
      })
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full border border-gray-300 rounded-md ml-1">
    <div
        className={``}
        style={{ maxHeight: maxHeight || "330px" }}
      >
        <table className="w-full border-collapse border-l-1 border-gray-300 rounded-md">
          <thead className="sticky top-0 z-10 bg-gray-100 rounded-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={classNames(
                      "px-3 py-2 mr-6 text-sm font-bold tracking-wider text-secondary border-b border-gray-300 select-none",
                      header.column.getCanSort() ? "cursor-pointer" : "",
                      header.id === "action" ? "text-center" : "text-left"
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" && (
                      <HiArrowSmUp className="inline-block ml-1 w-4 h-4" />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <HiArrowSmDown className="inline-block ml-1 w-4 h-4" />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => {
              const serialNumber = (currentPage - 1) * itemsPerPage + rowIndex + 1;
              return (
                <tr key={row.id} className="border-b border-gray-300">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-normal text-xs p-2">
                      {cell.column.id === "slNo"
                        ? serialNumber
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicTable;