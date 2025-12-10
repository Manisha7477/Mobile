import api from "@/api/axiosInstance";
import { Download, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";


interface Props {
    open: boolean;
    onClose: () => void;
}

const BulkHolidayModal: React.FC<Props> = ({ open, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [formRows, setFormRows] = useState<any[]>([]);
    const [showPreviewForm, setShowPreviewForm] = useState(false);

    if (!open) return null;

    const downloadTemplate = () => {
        const headers = "holiday_name,holiday_type,holiday_date,status\n";

        const blob = new Blob([headers], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "holiday_template.csv";
        link.click();
    };

    const fixDate = (dateStr: string) => {
        if (!dateStr.includes("-")) return dateStr;
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };


 const normalizeDate = (value: string) => {
    if (!value) return "";

    // Already ISO format
    if (/\d{4}-\d{2}-\d{2}/.test(value)) {
        return value;
    }

    // Detect dd/mm/yyyy OR d/m/yyyy
    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
        const [_, dd, mm, yyyy] = match;
        const d = dd.padStart(2, "0");
        const m = mm.padStart(2, "0");
        return `${yyyy}-${m}-${d}`; // Convert to ISO
    }

    // Fallback to JS date
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
    }

    return "";
};



    const parseCSV = (text: string) => {
        console.log("RAW TEXT:", JSON.stringify(text));

        // Clean BOM + invisible spaces
        text = text.replace(/^\uFEFF/, "").replace(/\u00A0/g, "").trim();

        const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
        if (rows.length < 2) {
            console.log("⚠ NO DATA ROWS FOUND");
            return [];
        }

        let firstRow = rows[0].trim();

        // -------- Detect delimiter --------
        let delimiter: string | RegExp = ",";

        if (firstRow.includes("\t")) delimiter = "\t";          // Tab
        else if (firstRow.includes(";")) delimiter = ";";       // Semicolon
        else if (/\s{2,}/.test(firstRow)) delimiter = /\s{2,}/; // MULTIPLE SPACES
        else delimiter = ",";

        console.log("Detected delimiter:", delimiter);

        // -------- Extract headers --------
        const headers =
            delimiter instanceof RegExp
                ? firstRow.split(delimiter).map(h => h.trim().toLowerCase())
                : firstRow.split(delimiter).map(h => h.trim().toLowerCase());

        console.log("Headers:", headers);

        // -------- Parse rows --------
        const records = rows.slice(1).map(row => {
            const cols =
                delimiter instanceof RegExp
                    ? row.split(delimiter).map(c => c.trim())
                    : row.split(delimiter).map(c => c.trim());

            const obj: any = {};
            headers.forEach((h, i) => (obj[h] = cols[i] || ""));

            return obj;
        });

        console.log("Parsed Records:", records);
        return records;
    };
    const excelDateToJSDate = (serial: number) => {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date = new Date(utc_value * 1000);

        let day = String(date.getDate()).padStart(2, "0");
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };
const getValue = (row: any, keys: string[]) => {
    for (const k of keys) {
        const found = Object.keys(row).find(x => x.trim().toLowerCase() === k.toLowerCase());
        if (found) return row[found];
    }
    return "";
};

    const handleUpload = () => {
        if (!file) return toast.error("Please upload a file!");

        const reader = new FileReader();

        // CASE 1: EXCEL (.xlsx/.xls)
        if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
            reader.onload = (e: any) => {
                try {
                    const XLSX = require("xlsx");
                    const workbook = XLSX.read(e.target.result, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    let rows = XLSX.utils.sheet_to_json(sheet, { raw: false });

                    if (rows.length === 0) {
                        toast.error("Excel has no data.");
                        return;
                    }

                    const mapped = rows.map((row: any) => {
                        let excelDate = getValue(row, [
                            "holiday_date",
                            "date",
                            "holiday date",
                            "Holiday_Date",
                            "Holiday Date",
                            "DATE"
                        ]);

                        let finalDate = "";

                        if (typeof excelDate === "number") {
                            finalDate = excelDateToJSDate(excelDate); // Excel serial number
                        } else {
                            finalDate = normalizeDate(excelDate || ""); // Normal string
                        }

                        return {
                            holiday_name: getValue(row, ["holiday_name", "Holiday Name", "holiday name", "HOLIDAY_NAME"]),
                            holiday_type: getValue(row, ["holiday_type", "Holiday Type", "holiday type"]),
                            holiday_date: finalDate,
                            status: getValue(row, ["status", "Status", "STATUS"]) || "Active"
                        };
                    });


                    setFormRows(mapped);
                    setShowPreviewForm(true);
                } catch (err) {
                    toast.error("Invalid Excel file format!");
                }
            };

            reader.readAsBinaryString(file);
            return;
        }

        // CASE 2: CSV fallback
        reader.onload = (e: any) => {
            const text = e.target.result;
            const parsed = parseCSV(text);

            if (parsed.length === 0) {
                toast.error("No valid records found.");
                return;
            }

            const mappedRows = parsed.map((row) => ({
                holiday_name: row.holiday_name || "",
                holiday_type: row.holiday_type || "",
                holiday_date: normalizeDate(row.holiday_date),
                status: row.status || "Active",
            }));

            setFormRows(mappedRows);
            setShowPreviewForm(true);
        };

        reader.readAsText(file, "UTF-8");
    };


    const updateField = (index: number, field: string, value: string) => {
        const updated = [...formRows];
        updated[index][field] = value;
        setFormRows(updated);
    };

    const handleConfirm = async () => {
        try {
            await Promise.all(
                formRows.map((h) =>
                    api.post("/api/holidays/", h)
                )
            );

            toast.success("Holidays added successfully!");
            setShowPreviewForm(false);
            setFile(null);
            onClose();
        } catch (err) {
            toast.error("Upload failed!");
        }
    };

    const handleReupload = () => {
        setFile(null);
        setFormRows([]);
        setShowPreviewForm(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[900px] rounded-xl p-6 shadow-xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Bulk Upload Holidays</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-600 hover:text-gray-800" size={22} />
                    </button>
                </div>

                <div className="flex gap-6">

                    {/* LEFT SECTION – Upload or Form Preview */}
                    <div className="flex-1">

                        {!showPreviewForm && (
                            <>
                                <label className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative">
                                    <Upload size={28} className="text-gray-400" />
                                    <p className="text-gray-500 text-sm mt-2">
                                        {file ? file.name : "Upload holiday_template (CSV / Excel)"}
                                    </p>

                                    <input
                                        type="file"
                                        accept=".csv, .xlsx, .xls"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                </label>


                                <button
                                    onClick={handleUpload}
                                    className="mt-4 bg-blue-600 text-white py-2 rounded-md w-full flex items-center justify-center gap-2"
                                >
                                    <Upload size={18} /> Upload
                                </button>
                            </>
                        )}

                        {/* -------------------- FORM PREVIEW -------------------- */}
                        {showPreviewForm && (
                            <div className="mt-4">
                                <h3 className="font-semibold mb-3">
                                    Preview & Edit Holidays ({formRows.length})
                                </h3>

                                {/* --------- HEADER ROW (SHOWN ONLY ONCE) --------- */}
                                <div className="grid grid-cols-4 gap-3 bg-gray-100 rounded-lg p-3 font-medium text-sm border">
                                    <div>Holiday Name</div>
                                    <div>Holiday Type</div>
                                    <div>Date</div>
                                    <div>Status</div>
                                </div>

                                {/* --------- DATA ROWS FROM CSV --------- */}
                                <div className="max-h-[300px] overflow-y-auto hide-scrollbar mt-2">
                                    {formRows.map((row, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-4 hide scrollbar gap-3 p-1 rounded-lg mb-3"
                                        >
                                            {/* Holiday Name */}
                                            <input
                                                value={row.holiday_name}
                                                onChange={(e) =>
                                                    updateField(index, "holiday_name", e.target.value)
                                                }
                                                className="w-full text-sm"
                                            />


                                            <input
                                                type="text"
                                                placeholder="Public / Restricted"
                                                value={row.holiday_type}
                                                onChange={(e) =>
                                                    updateField(index, "holiday_type", e.target.value)
                                                }
                                                className="w-full text-sm border rounded px-2 py-1"
                                            />

                                            {/* Date */}
                                            <input
                                                type="date"
                                                value={row.holiday_date}
                                                onChange={(e) =>
                                                    updateField(index, "holiday_date", e.target.value)
                                                }
                                                className="w-full text-sm"
                                            />

                                            {/* Status */}
                                            <input
                                                value={row.status}
                                                onChange={(e) =>
                                                    updateField(index, "status", e.target.value)
                                                }
                                                className="w-full text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-between mt-5">
                                    <button
                                        onClick={handleReupload}
                                        className="border px-4 py-2 rounded-md"
                                    >
                                        Re-upload
                                    </button>

                                    <button
                                        onClick={handleConfirm}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                    >
                                        Confirm & Add Holidays
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT SECTION – Instructions */}
                    <div className="w-1/3 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Instructions</h3>

                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>
                                Download template{" "}
                                <span
                                    className="text-blue-600 underline cursor-pointer"
                                    onClick={downloadTemplate}
                                >
                                    here
                                </span>
                            </li>
                            <li>CSV only</li>
                            <li>Max 500 holidays</li>
                            <li>All fields required</li>
                            <li>File size &lt; 50 KB</li>
                        </ul>

                        <button
                            onClick={downloadTemplate}
                            className="mt-4 bg-white border px-4 py-2 rounded-md text-sm flex items-center gap-2"
                        >
                            <Download size={16} /> Download Template
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded-md">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkHolidayModal;


