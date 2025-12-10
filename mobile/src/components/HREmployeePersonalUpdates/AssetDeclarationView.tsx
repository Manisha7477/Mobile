// AssetDeclarationView.tsx
import React, { useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import api from "@/api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
 
type MaybeString = string | null | undefined;
 
const AssetDeclarationView: React.FC = () => {
  const { id } = useParams(); // /view/:id
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement | null>(null);
 
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
 
  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userData") || "{}")
      : {};
 
  const employeeName = `${storedUser.firstName || ""} ${
    storedUser.lastName || ""
  }`.trim();
 
  /** Build absolute API URL */
  const buildFullUrl = (u?: MaybeString) => {
    if (!u) return "";
    if (typeof u !== "string") return "";
    if (u.startsWith("http")) return u;
    const base = api.defaults.baseURL?.replace(/\/+$/, "") ?? "";
    return `${base}/${u}`.replace(/\\/g, "/");
  };
 
  /** -------- FETCH DATA (Corrected for your API format) -------- */
  const fetchRecord = async () => {
    if (!id) return;
    try {
      setLoading(true);
 
      // API returns ARRAY
      const res = await api.get(`/api/asset-declaration/user/${id}`);
      const list = Array.isArray(res.data) ? res.data : [];
 
      // Group them by type
      const immovable = list.filter((x) => x.asset_type === "Immovable Property");
      const movable = list.filter((x) => x.asset_type === "Movable Property");
 
      // Use header row for common details
      const header = list[0] || {};
 
      setData({
        date: header.date || "",
        financial_year: header.financial_year || "",
        signature: header.signature || null,
        documents: header.document || [],
        immovable_property: immovable,
        movable_property: movable,
        employee_full_name: employeeName,
      });
    } catch (err) {
      console.error("fetch asset-declaration:", err);
      toast.error("Failed to fetch asset declaration");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchRecord();
  }, [id]);
 
  /** ------------------- PDF DOWNLOAD ------------------- */
  const downloadPDF = async () => {
    if (!formRef.current) return;
    const el = formRef.current;
 
    const prevHeight = el.style.height;
    const prevOverflow = el.style.overflow;
    el.style.height = "auto";
    el.style.overflow = "visible";
 
    await new Promise((r) => setTimeout(r, 200));
 
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
 
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const ratio = canvas.width / canvas.height;
      const pdfHeight = pageWidth / ratio;
 
      let heightLeft = pdfHeight;
      let position = 0;
 
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, pdfHeight);
      heightLeft -= 297;
 
      while (heightLeft > 0) {
        position -= 297;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, pdfHeight);
        heightLeft -= 297;
      }
 
      pdf.save(`Asset_Declaration_${id}.pdf`);
    } catch (e) {
      toast.error("Failed to export PDF");
    } finally {
      el.style.height = prevHeight;
      el.style.overflow = prevOverflow;
    }
  };
 
  /** ------------- Loading & No-Data ---------------- */
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
        Loading...
      </div>
    );
  }
 
  if (!data) {
    return (
      <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center">
        <p className="text-gray-600">No asset declaration found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-gray-200 rounded"
        >
          Close
        </button>
      </div>
    );
  }
 
  /** Helpers */
  const show = (v: any) =>
    v === null || v === undefined || (typeof v === "string" && v.trim() === "")
      ? ""
      : v;
 
  const getField = (item: any, ...keys: string[]) => {
    for (const k of keys) {
      if (item && item[k] !== undefined && item[k] !== null) return item[k];
    }
    return "";
  };
 
  /** Extract */
  const immovableList = data.immovable_property || [];
  const movableList = data.movable_property || [];
  const documents = data.documents || [];
  const signatureUrl = buildFullUrl(data.signature);
 
  const date: MaybeString = data.date || "";
  const financialYear: MaybeString = data.financial_year || "";
 
  return (
    <div className="w-full">
      <div className="h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar bg-white rounded-lg shadow p-4 sm:p-6 text-xs sm:text-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Asset Declaration</h3>
            <p className="text-xs text-gray-500">View submitted declaration</p>
          </div>
 
          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="px-4 py-1 bg-green-600 text-white rounded text-xs"
            >
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-2"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
 
        {/* Content */}
        <div ref={formRef} className="bg-white rounded p-3">
          {/* Top info */}
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[11px] text-gray-600">Date</div>
                <div className="mt-1 border rounded px-3 py-2 bg-gray-50 w-56">
                  {show(date)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-600">Financial Year</div>
                <div className="mt-1 border rounded px-3 py-2 bg-gray-50 w-56">
                  {show(financialYear)}
                </div>
              </div>
            </div>
 
           
          </div>
 
          {/* Immovable Property */}
          <div className="mb-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b px-4 py-2 text-sm font-semibold">
              Immovable Property
            </div>
 
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border px-3 py-2">Sl No.</th>
                    <th className="border px-3 py-2">Details of property</th>
                    <th className="border px-3 py-2">Held in name</th>
                    <th className="border px-3 py-2">Date of acquisition</th>
                    <th className="border px-3 py-2">Nature</th>
                    <th className="border px-3 py-2">Party</th>
                    <th className="border px-3 py-2 text-right">
                      Quantum of finance
                    </th>
                    <th className="border px-3 py-2">Source of finance</th>
                    <th className="border px-3 py-2 text-right">Profit</th>
                  </tr>
                </thead>
 
                <tbody>
                  {immovableList.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="p-4 text-center text-gray-500"
                      >
                        No immovable property records
                      </td>
                    </tr>
                  )}
 
                  {immovableList.map((row: any, idx: number) => (
                    <tr className="odd:bg-white even:bg-gray-50" key={idx}>
                      <td className="border px-3 py-2">{idx + 1}</td>
 
                      <td className="border px-3 py-2">
                        {show(getField(row, "details"))}
                      </td>
 
                      <td className="border px-3 py-2">
                        {show(getField(row, "held_in_name"))}
                      </td>
 
                      <td className="border px-3 py-2">
                        {show(getField(row, "acquisition_date"))}
                      </td>
 
                      <td className="border px-3 py-2">
                        {show(getField(row, "nature"))}
                      </td>
 
                      <td className="border px-3 py-2">
                        {show(getField(row, "party"))}
                      </td>
 
                      <td className="border px-3 py-2 text-right">
                        {show(getField(row, "finance_amount"))}
                      </td>
 
                      <td className="border px-3 py-2">
                        {show(getField(row, "source_of_finance"))}
                      </td>
 
                      <td className="border px-3 py-2 text-right">
                        {show(getField(row, "profit_amount"))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
 
          {/* Movable Property */}
          <div className="mb-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b px-4 py-2 text-sm font-semibold">
              Movable Property
            </div>
 
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border px-3 py-2">Sl No.</th>
                  <th className="border px-3 py-2">Details of property</th>
                  <th className="border px-3 py-2">Held in name</th>
                  <th className="border px-3 py-2">Date of acquisition</th>
                  <th className="border px-3 py-2">Nature</th>
                  <th className="border px-3 py-2">Party</th>
                  <th className="border px-3 py-2 text-right">Quantum</th>
                  <th className="border px-3 py-2">Source of finance</th>
                  <th className="border px-3 py-2 text-right">Profit</th>
                </tr>
              </thead>
 
              <tbody>
                {movableList.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500">
                      No movable property records
                    </td>
                  </tr>
                )}
 
                {movableList.map((row: any, idx: number) => (
                  <tr className="odd:bg-white even:bg-gray-50" key={idx}>
                    <td className="border px-3 py-2">{idx + 1}</td>
 
                    <td className="border px-3 py-2">
                      {show(getField(row, "details"))}
                    </td>
 
                    <td className="border px-3 py-2">
                      {show(getField(row, "held_in_name"))}
                    </td>
 
                    <td className="border px-3 py-2">
                      {show(getField(row, "acquisition_date"))}
                    </td>
 
                    <td className="border px-3 py-2">
                      {show(getField(row, "nature"))}
                    </td>
 
                    <td className="border px-3 py-2">
                      {show(getField(row, "party"))}
                    </td>
 
                    <td className="border px-3 py-2 text-right">
                      {show(getField(row, "finance_amount"))}
                    </td>
 
                    <td className="border px-3 py-2">
                      {show(getField(row, "source_of_finance"))}
                    </td>
 
                    <td className="border px-3 py-2 text-right">
                      {show(getField(row, "profit_amount"))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* Documents */}
          <div className="border rounded-md p-4 mb-6">
            <p className="font-semibold text-xs mb-2">Uploaded Documents</p>
            {documents.length === 0 ? (
              <p className="text-xs text-gray-600">No documents uploaded.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((d: string, i: number) => {
                  const url = buildFullUrl(d);
                  const filename = d.split("/").pop();
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2"
                    >
                      <div className="text-xs truncate max-w-[70%]">
                        {filename}
                      </div>
                      <div className="flex gap-2">
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Open
                          </a>
                        )}
                        <button
                          onClick={() => window.open(url, "_blank")}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Declaration & Signature */}
          <div className="mb-6">
            <p className="text-[11px] leading-relaxed">
              ☑ I hereby declare that the information given above is true,
              complete and correct to the best of my knowledge and belief.
            </p>
 
       
 
            <div className="mt-4">
              <label className="text-[11px]">Signature</label>
              <div className="border w-40 h-20 bg-gray-50 flex items-center justify-center mt-1">
                {signatureUrl ? (
                  <img
                    src={signatureUrl}
                    alt="signature"
                    className="max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No signature</span>
                )}
              </div>
            </div>
          </div>
        </div>
 
        {/* Footer */}
        <div className="flex justify-end mt-3 border-t pt-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default AssetDeclarationView;