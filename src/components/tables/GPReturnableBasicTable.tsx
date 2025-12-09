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
  HiEye,
  HiPencil,
} from "react-icons/hi";
import { classNames } from "@/utils/dom";
import { ITableHeader, ITableData, ITableRow } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axiosInstance";

interface IGPBasicTableProps<T> {
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
  gate_pass_no: string;
  status?: string;
  hira_reviewer_id?: number;
  sic_id?: number;
  approver_id?: number;
  created_by: string;
  outward_id: string;
  returnable: boolean;
  inward_id: string;
  formtype: string;
}


const GPReturnableBasicTable = <T extends MocRowBase>({
  tableHeader,
  tableData,
  handleClickEditAction,
  handleClickViewAction,
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  showAddButton,
  addButtonLabel,
  onAddButtonClick,
  maxHeight,
}: IGPBasicTableProps<T>) => {
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

    console.log("datadatadatadata", tableData);


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
  console.log("tableData", tableData);


  const handleClickView = (row: T) => handleClickViewAction?.(row);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const handleReturnablekReview = (row: T) => {
    navigate(
      `/station-operations/gate-pass/ReturnableReview/${encodeURIComponent(
        row.outward_id
      )}`,
      { state: row })
  };

  //inward Review
  const handleInwardReview = (row: T) => {
    navigate(
      `/station-operations/gate-pass/InwardReviewer/${encodeURIComponent(
        row.inward_id
      )}`,
      { state: row })
  };

  //Outward Review
  const handleOutwardClickReview = (row: T) => {
    navigate(
      `/station-operations/gate-pass/outward-reviewer/${encodeURIComponent(
        row.outward_id
      )}`,
      { state: row })
  };

  const handleReturnableClick = (row: T) => {
    navigate(
      `/station-operations/gate-pass/create-returnable/${encodeURIComponent(
        row.outward_id
      )}`,
      { state: row })
  };

  const handleVerifyClick = (row: T) => {
    navigate(
      `/station-operations/gate-pass/security-outward-verification/${encodeURIComponent(
        row.outward_id
      )}`,
      { state: row })
  };

  // Helper function to determine review button state
  const getReviewButtonConfig = (rowData: any) => {
    const approver_id = rowData.approver_id;
    const status = rowData.status;

    if (username === "Security" && status === "Verified") {
      return {
        isEnabled: true,
        handler: handleReturnableClick,
        row: rowData
      };
    }

    if (userId === approver_id && status === "Pending Approval") {
      return {
        isEnabled: true,
        handler: handleInwardReview,
        row: rowData
      };
    }

    if (userId === approver_id && status === "Pending Approval") {
      return {
        isEnabled: true,
        handler: handleOutwardClickReview,
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

          // if (info.column.id === "action") {
          //   const rowData = info.row.original;
          //   const reviewConfig = getReviewButtonConfig(rowData);

          //   // GET STORED USER ROLE
          //   const storedUser =
          //     typeof window !== "undefined" ? localStorage.getItem("userData") : null;
          //   const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          //   const roleName = parsedUser?.roleName;   

          //   const canVerify =
          //     roleName === "Security" &&
          //     rowData.status === "Pending Verification";

          //   const handleVerifyClick = () => {
          //     console.log("VERIFY CLICKED:", rowData);
          //     // 👉 Add your navigation or API call here
          //   };

          //   return (
          //     <div className="flex justify-center gap-2 text-gray-600 items-center">

          //       {/* 👁 VIEW BUTTON */}
          //       <HiEye
          //         onClick={() => handleClickView(rowData)}
          //         className="cursor-pointer text-tableHeaderbg hover:text-secondary transition w-5 h-5"
          //       />
          //       <span>View</span>

          //       {/* 🔍 REVIEW BUTTON */}
          //       <button
          //         disabled={!reviewConfig.isEnabled}
          //         onClick={() => reviewConfig.handler(reviewConfig.row)}
          //         className={`text-sm font-semibold px-1 py-0.5 rounded-md shadow-md transition
          // ${reviewConfig.isEnabled
          //             ? "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
          //             : "bg-gray-400 text-gray-200 cursor-not-allowed"
          //           }`}
          //       >
          //         Review
          //       </button>

          //       {/* 🆕 ✅ VERIFY BUTTON */}
          //       <button
          //         disabled={!canVerify}
          //         onClick={handleVerifyClick}
          //         className={`text-sm font-semibold px-1 py-0.5 rounded-md shadow-md transition
          // ${canVerify
          //             ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          //             : "bg-gray-300 text-gray-200 cursor-not-allowed"
          //           }`}
          //       >
          //         Verify
          //       </button>
          //     </div>
          //   );
          // }

          if (info.column.id === "action") {
            const rowData = info.row.original;

            // Logged in user
            const storedUser =
              typeof window !== "undefined" ? localStorage.getItem("userData") : null;
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;

            const roleName = parsedUser?.roleName;
            const userId = parsedUser?.userId;
            const username = parsedUser?.username;

            const { status, approver_id, returnable, formtype } = rowData;

            // ⭐ 1. OUTWARD REVIEW (Pending Approval)
            const showOutwardReview =
              userId === approver_id && status === "Pending Approval" && formtype === "outward";

            // ⭐ 2. INWARD REVIEW (Pending Approval)
            const showInwardReview =
              userId === approver_id && status === "Pending Approval" && formtype === "inward";

            // ⭐ 3. SECURITY VERIFY (Pending Verification)
            const showVerify =
              roleName === "Security" && status === "Pending Verification";

            // ⭐ 4. CREATE RETURN (Security + Verified + returnable true)
            const showCreateReturn =
              roleName === "Security" &&
              status === "Verified==========" &&
              returnable === true;

            // ⭐ 5. RETURNABLE REVIEW (Approver + Returnable)
            const showReturnableReview =
              // userId === approver_id && status === "Returnable";
              status === "Verified";

            return (
              <div className="flex justify-center gap-2 text-gray-600 items-center">

                {/* VIEW BUTTON */}
                <button
                  onClick={() => handleClickView(rowData)}
                  className="flex items-center gap-1 cursor-pointer hover:text-secondary"
                >
                  <HiEye className="w-5 h-5" /> View
                </button>

                {/* ⭐ 1. OUTWARD REVIEW BUTTON */}
                {showOutwardReview && (
                  <button
                    onClick={() =>
                      navigate(
                        `/station-operations/gate-pass/outward-reviewer/${encodeURIComponent(
                          rowData.outward_id
                        )}`,
                        { state: rowData }
                      )
                    }
                    className="text-xs font-semibold px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
                  >
                    Outward Review
                  </button>
                )}

                {/* ⭐ 2. INWARD REVIEW BUTTON */}
                {showInwardReview && (
                  <button
                    onClick={() =>
                      navigate(
                        `/station-operations/gate-pass/InwardReviewer/${encodeURIComponent(
                          rowData.inward_id
                        )}`,
                        { state: rowData }
                      )
                    }
                    className="text-xs font-semibold px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
                  >
                    Inward Review
                  </button>
                )}

                {/* ⭐ 3. SECURITY VERIFY */}
                {showVerify && (
                  <button
                    onClick={() =>
                      navigate(
                        `/station-operations/gate-pass/security-outward-verification/${encodeURIComponent(
                          rowData.outward_id
                        )}`,
                        { state: rowData }
                      )
                    }
                    className="text-xs font-semibold px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md"
                  >
                    Verify
                  </button>
                )}

                {/* ⭐ 4. CREATE RETURN */}
                {showCreateReturn && (
                  <button
                    onClick={() =>
                      navigate(
                        `/station-operations/gate-pass/create-returnable/${encodeURIComponent(
                          rowData.outward_id
                        )}`,
                        { state: rowData }
                      )
                    }
                    className="text-xs font-semibold px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md"
                  >
                    Create Return
                  </button>
                )}

                {/* ⭐ 5. RETURNABLE REVIEW */}
                {showReturnableReview && (
                  <button
                    onClick={() =>
                      navigate(
                        `/station-operations/gate-pass/review-returnable/${encodeURIComponent(
                          rowData.outward_id
                        )}`,
                        { state: rowData }
                      )
                    }
                    className="text-xs font-semibold px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md"
                  >
                    Returnable Review
                  </button>
                )}
              </div>
            );
          }
          if (info.column.id === "status") {
            const rowData = info.row.original;
            const rawStatus = rowData.status ?? ""; // ensures it's never undefined
            const status = rawStatus.toLowerCase();

            // Define background colors safely
            const statusBG: Record<string, string> = {
              "pending approval": "bg-yellow-200",
              "pending verification": "bg-pink-200",
              "verified": "bg-blue-200",
              "returnable": "bg-orange-200",
              "approved": "bg-green-200",
              "draft": "bg-gray-200",
            };
            const bgColor = statusBG[status] || "bg-gray-200";
            return (
              <span
                className={`px-2 py-1 rounded-xl text-xs font-medium inline-block w-fit ${bgColor}`}
              >
                {rawStatus}

                {rawStatus === "Draft" && rowData.created_by === username && (
                  <HiPencil
                    className="w-4 h-4 ml-1 text-green-500 cursor-pointer hover:text-green-600 inline"
                    onClick={() => handleEditClick(rowData.gate_pass_no)}
                  />
                )}
              </span>
            );
          }
          if (info.column.id === "status") {
            const statusValue = (info.renderValue() as string)?.toLowerCase();
            let textColor = "text-gray-800";
            if (statusValue === "approved") textColor = "text-green-600";
            else if (statusValue === "verified") textColor = "text-green-600";
            else if (statusValue === "pending approval") textColor = "text-green-600";
            else if (statusValue === "save draft") textColor = "text-gray-600";
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
                <tr key={row.id} className="border-b border-gray-300 overflow-y-auto overflow-x-auto hide-scrollbar">
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

export default GPReturnableBasicTable;
