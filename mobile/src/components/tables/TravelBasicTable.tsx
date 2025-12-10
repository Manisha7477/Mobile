import React from "react";
import { Check } from "lucide-react";
import { HiEye } from "react-icons/hi";

interface ITableHeader {
  name: string;
  display: string;
}

interface TravelBasicTableProps {
  headers: ITableHeader[];
  data: any[];
  onView: (row: any) => void;
  showReview?: boolean;
}

export const statusColors: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-blue-100 text-blue-700",
  "Changes Request": "bg-orange-100 text-orange-700",
  Rejected: "bg-red-100 text-red-700",
  Processing: "bg-yellow-100 text-yellow-700",
};

const TravelBasicTable: React.FC<TravelBasicTableProps> = ({ headers, data, onView, showReview }) => {
  return (
    <div className="overflow-x-auto w-full ">
      <div className="overflow-y-auto border rounded-md max-h-[calc(100vh-180px)] pb-6">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="bg-gray-100 text-gray-700">
              {headers.map((h) => (
                <th key={h.name} className="p-3 font-semibold text-left">
                  {h.display}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                {headers.map((h) => (
                  <td key={h.name} className="whitespace-normal text-xs p-2">

                    {/* {h.name === "action" ? (
                    <button
                    className="px-3 py-1 rounded-md border bg-white shadow-sm text-sm hover:bg-gray-100"
                    onClick={() => onView(row)}
                    >
                    View Timeline
                    </button>
 
                  ) : null} */}
                    {h.name === "action" && (
                      <div className="flex items-center gap-2">
                        {/* VIEW BUTTON */}
                        {/* 
                        <button
                          className="px-3 py-1 rounded-md border bg-white shadow-sm text-sm hover:bg-gray-100"
                          onClick={() => onView(row)}
                        >
                          View
                        </button> */}
                        <HiEye
                          onClick={() => onView(row)}
                          className="cursor-pointer text-tableHeaderbg hover:text-secondary transition w-5 h-5"
                        />View

                        {/* REVIEW BUTTON — ONLY WHEN showReview = true */}
                        {showReview && (
                          <button
                            className="px-3 py-1 rounded-md bg-blue-500 text-white shadow-sm text-sm hover:bg-blue-600"
                            onClick={() => console.log("Review:", row)}
                          >
                            Review
                          </button>
                        )}
                      </div>
                    )}
                    {h.name === "status" ? (
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[row[h.name]] || "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {row[h.name]}
                      </span>
                    ) : null}

                    {h.name === "violations" && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                          ${row[h.name] > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {row[h.name] > 0
                          ? `${row[h.name]} violation(s)`
                          : "No violations"}
                      </span>
                    )}
                    {h.name === "amount_disbursed" ? (
                      row.amount_disbursed ? (
                        <Check className="text-green-700 bg-green-100 rounded-full p-1 w-6 h-6" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                      )
                    ) : null}

                    {h.name !== "action" &&
                      h.name !== "status" &&
                      h.name !== "amount_disbursed" &&
                      h.name !== "violations" &&
                      row[h.name]}
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

export default TravelBasicTable;