import React, { useEffect, useState } from "react";
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
} from "react-icons/hi";
import { classNames } from "@/utils/dom";
import { ITableHeader } from "@/utils/types";
import { useNavigate } from "react-router-dom";
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
  hideView?: boolean;
}
interface MocRowBase {
  moc_request_no: string;
  status?: string;
  hira_reviewer_id?: number;
  sic_id?: number;
  approver_id?: number;
  created_by: string;
  user_id?: number | string;
  username?: string;
  from_user?: string;
}

const HRBasicTable = <T extends MocRowBase>({
  tableHeader,
  tableData,
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
}: IBasicTableProps<T>) => {
  // const [data, setData] = useState(tableData);
  const [data, setData] = useState<any[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();
  const storedUser =
  typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.userId;
  const username = parsedUser?.username;

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const isEditProfileRoot = window.location.pathname === "/hr-admin/personal-updates";
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
            const row = info.row.original;
            const status = row?.status;
            const isEnabled = status === "Pending Approval";
            return (
              <div className="flex justify-center gap-1 text-gray-600">
                <button
                  disabled={!isEnabled}
                  onClick={() => {
                    if (isEnabled) {
                      navigate(
                        `/user-management/manage-user/edit-profile/${row.user_id}`,
                        { state: { shouldFetch: true } }
                      );
                    }
                  }}
                  className={`text-sm font-semibold px-2 py-1 rounded-md shadow-md transition
          ${isEnabled
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
            const statusValue = (info.renderValue() as string)?.toLowerCase();
            let textColor = "text-gray-800";
            if (statusValue === "approved") textColor = "text-green-600";
            else if (statusValue === "pending approval") textColor = "text-blue-300";
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
        className={`
  `}
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
                <tr key={row.id} className="border-b border-gray-300  overflow-y-auto overflow-x-auto hide-scrollbar">
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

export default HRBasicTable;