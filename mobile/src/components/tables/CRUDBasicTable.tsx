import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { HiEye, HiOutlineTrash } from "react-icons/hi";
import { MdEditSquare } from "react-icons/md";
import { ITableHeader, ITableData } from "@/utils/types";

interface IBasicTableProps {
  tableHeader: ITableHeader[];
  tableData: ITableData[];
  handleEdit?: (row: ITableData) => void;
  handleView?: (row: ITableData) => void;
  handleDelete?: (row: ITableData) => void;
}

const columnHelper = createColumnHelper<ITableData>();

const CRUDBasicTable: React.FC<IBasicTableProps> = ({
  tableHeader,
  tableData,
  handleEdit,
  handleView,
  handleDelete,
}) => {
  const [data, setData] = useState(tableData);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const columns = tableHeader.map((header) =>
    columnHelper.accessor(header.name, {
      header: () => header.display,
      cell: (info) =>
        header.name === "action" ? (
          <div className="-ml-12 flex gap-2 justify-center">
            <MdEditSquare
              onClick={() => handleEdit?.(info.row.original)}
              className="cursor-pointer text-primary hover:opacity-60 w-5 h-5"
            />

            <HiEye
              onClick={() => handleView?.(info.row.original)}
              className="cursor-pointer hover:opacity-60 w-5 h-5"
            />

            <HiOutlineTrash
              onClick={() => handleDelete?.(info.row.original)}
              className="cursor-pointer text-red-600 hover:opacity-60 w-5 h-5"
            />
          </div>
        ) : (
          info.renderValue()
        ),
    })
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

return (
  <div className="border rounded-md">
    <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
      <table className="table w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 text-left text-sm font-semibold bg-gray-100 sticky top-0 z-10"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 text-xs">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default CRUDBasicTable;
