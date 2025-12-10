// AssetTable.tsx
import React from "react";

export interface AssetRow {
  details?: string;
  held_in_name?: string;
  acquisition_date?: string;
  nature?: string;
  party?: string;
  finance_amount?: string;
  source_of_finance?: string;
  profit_amount?: string;
  asset_id?: string;
  asset_type?: "Immovable Property" | "Movable Property";
}

const columns = [
  "Details of property with address",
  "Held in whose name",
  "Date of acquisition",
  "Nature of transaction",
  "Party to transaction with address",
  "Quantum of finance",
  "Source of finance in case of Purchase",
  "Amount of profit from Property",
];

interface Props {
  title: string;
  rows: AssetRow[];
  readOnly?: boolean;
  onRowsChange: (rows: AssetRow[]) => void;
}

const emptyRow = (): AssetRow => ({
  details: "",
  held_in_name: "",
  acquisition_date: "",
  nature: "",
  party: "",
  finance_amount: "",
  source_of_finance: "",
  profit_amount: "",
});

const AssetTable: React.FC<Props> = ({ title, rows, onRowsChange, readOnly }) => {
  const addRow = () => {
    if (readOnly) return;
    onRowsChange([...rows, emptyRow()]);
  };

  const updateCell = (index: number, key: keyof AssetRow, value: string) => {
    if (readOnly) return;
    const updated = rows.map((row, i) =>
      i === index ? { ...row, [key]: value } : row
    );
    onRowsChange(updated);
  };

  const removeRow = (index: number) => {
    if (readOnly) return;
    if (rows.length === 1) {
      onRowsChange([emptyRow()]);
      return;
    }
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="font-semibold">{title}</h4>

        <button
          onClick={addRow}
          disabled={readOnly}
          className={`px-2 rounded text-white ${
            readOnly ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          +
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto border rounded">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-sm font-semibold border">Sl No.</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-sm font-semibold border">
                  {col}
                </th>
              ))}
              <th className="px-3 py-2 text-sm font-semibold border">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="align-top">
                <td className="border px-2 py-2">{index + 1}</td>

                {/* details */}
                <td className="border px-2 py-2">
                  <input
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.details || ""}
                    disabled={readOnly}
                    onChange={(e) => updateCell(index, "details", e.target.value)}
                  />
                </td>

                {/* held_in_name */}
                <td className="border px-2 py-2">
                  <input
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.held_in_name || ""}
                    disabled={readOnly}
                    onChange={(e) => updateCell(index, "held_in_name", e.target.value)}
                  />
                </td>

                {/* acquisition_date */}
                <td className="border px-2 py-2">
                  <input
                    type="date"
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.acquisition_date || ""}
                    disabled={readOnly}
                    onChange={(e) => updateCell(index, "acquisition_date", e.target.value)}
                  />
                </td>

                {/* nature */}
                <td className="border px-2 py-2">
                  <input
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.nature || ""}
                    disabled={readOnly}
                    onChange={(e) => updateCell(index, "nature", e.target.value)}
                  />
                </td>

                {/* party */}
                <td className="border px-2 py-2">
                  <input
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.party || ""}
                    disabled={readOnly}
                    onChange={(e) => updateCell(index, "party", e.target.value)}
                  />
                </td>

                {/* finance_amount */}
                <td className="border px-2 py-2">
                  <input
                    type="number"
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.finance_amount ?? ""}
                    disabled={readOnly}
                    onChange={(e) => updateCell(index, "finance_amount", e.target.value)}
                  />
                </td>

                {/* source_of_finance */}
                <td className="border px-2 py-2">
                  <input
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.source_of_finance || ""}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateCell(index, "source_of_finance", e.target.value)
                    }
                  />
                </td>

                {/* profit_amount */}
                <td className="border px-2 py-2">
                  <input
                    type="number"
                    className={`w-full border rounded px-2 py-1 ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={row.profit_amount ?? ""}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateCell(index, "profit_amount", e.target.value)
                    }
                  />
                </td>

                {/* remove button */}
                <td className="border px-2 py-2 text-center">
                  <button
                    onClick={() => removeRow(index)}
                    disabled={readOnly}
                    className={`px-2 py-1 border rounded text-sm ${
                      readOnly
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-2 gap-2">
        <button
          disabled={readOnly}
          className={`px-2 py-1 rounded text-white ${
            readOnly ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AssetTable;