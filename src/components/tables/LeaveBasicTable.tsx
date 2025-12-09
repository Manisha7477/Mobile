import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { HiArrowSmDown, HiArrowSmUp, HiEye } from "react-icons/hi";
import { classNames } from "@/utils/dom";
import { ITableHeader } from "@/utils/types";

interface IBasicTableProps<T> {
  tableHeader: ITableHeader[];
  tableData: T[];
  handleClickViewAction?: (row: T) => void;
  handleLeaveReviewAction?: (row: T) => void;
  currentPage: number;
  itemsPerPage: number;
  maxHeight?: string;
  showAddButton?: boolean;
}

interface MocRowBase {
  moc_request_no: string;
  status?: string;
  supervisor_id?: number;
  created_by?: string;
}

const LeaveBasicTable = <T,>({
  tableHeader,
  tableData,
  handleClickViewAction,
  handleLeaveReviewAction,
  currentPage,
  itemsPerPage,
  maxHeight,
  showAddButton,
}: IBasicTableProps<T>) => {
  const [data, setData] = useState<T[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  console.log("table data", tableData);
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const handleClickView = (row: T) => {
    if (handleClickViewAction) handleClickViewAction(row);
  };
  const getReviewButtonConfig = (rowData: any) => {
    const isPending = (rowData.status || "").toLowerCase() === "pending";

    const isHrAllowed =
      parsedUser?.roleName === "HR" && parsedUser?.userId === rowData?.hr_id;

    const isSupervisorAllowed =
      parsedUser?.roleName === "Supervisor" &&
      parsedUser?.userId === rowData?.supervisor_id;

    const isEnabled = isPending && (isHrAllowed || isSupervisorAllowed);

    return {
      isEnabled,
      handler: isEnabled
        ? () => handleLeaveReviewAction?.(rowData)
        : () => { },
    };
  };


  const columnHelper = createColumnHelper<T>();
  const columns = tableHeader.map((header) =>
    columnHelper.accessor(
      (row: T) => (row as any)[header.name],
      {
        id: header.name,
        header: () => header.display,
        cell: (info) => {
          const rowData = info.row.original;

          if (info.column.id === "action") {
            const reviewConfig = getReviewButtonConfig(rowData);
            return (
              <div className="flex justify-center gap-2 text-gray-600">
                {/* View Button */}
                <button
                  onClick={() => handleClickView(rowData)}
                  className="flex items-center gap-1 text-sm px-2 py-1 hover:bg-gray-100"
                >
                  <HiEye className="w-4 h-4" />
                  View
                </button>

                {/* Review Button */}
                {reviewConfig.isEnabled && (
                  <button
                    onClick={reviewConfig.handler}
                    className="text-sm font-semibold px-2 py-1 rounded-md shadow-md text-white bg-blue-700 hover:bg-blue-800"
                  >
                    Review
                  </button>
                )}
              </div>
            );
          }


          if (info.column.id === "status") {
            const statusValue = (info.renderValue() as string)?.toLowerCase();
            let textColor = "text-gray-800";
            if (statusValue === "approved") textColor = "text-green-600";
            else if (statusValue === "pending") textColor = "text-blue-600";
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
    <div className="border border-gray-300 rounded-md ml-1">
      <div style={{ maxHeight: maxHeight || "800px" }}>
        <table className="w-full border-collapse border-l-1 border-gray-300 rounded-md">
          <thead className="sticky top-0 z-10 bg-gray-100 rounded-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={classNames(
                      "px-3 py-3 mr-6 text-sm font-bold tracking-wider text-secondary border-b border-gray-300 select-none",
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
              const serialNumber =
                (currentPage - 1) * itemsPerPage + rowIndex + 1;
              return (
                <tr
                  key={row.id}
                  className="border-b border-gray-300 overflow-y-auto overflow-x-auto hide-scrollbar"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-normal text-xs p-3">
                      {cell.column.id === "slNo"
                        ? serialNumber
                        : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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

export default LeaveBasicTable;
