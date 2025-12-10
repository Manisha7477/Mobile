// Form12CView.tsx
import React, { useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import api from "@/api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
 
const Form12CView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
 
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
 
  const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const employeeName = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`;
 
  const buildFullUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = api.defaults.baseURL?.replace(/\/+$/, "") || "";
    return `${base}/${url}`.replace(/\\/g, "/");
  };
 
  // ===== Fetch Record =====
  const fetchRecord = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/form12c/${id}`);
      setData(res.data);
    } catch (e) {
      toast.error("Failed to load Form 12C");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchRecord();
  }, [id]);
 
  // ===== PDF Download =====
  const downloadPDF = async () => {
    if (!formRef.current) return;
    const el = formRef.current;
 
    const origHeight = el.style.height;
    const origOverflow = el.style.overflow;
    el.style.height = "auto";
    el.style.overflow = "visible";
 
    await new Promise((r) => setTimeout(r, 200));
 
    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");
 
    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;
 
    let heightLeft = h;
    let position = 0;
 
    pdf.addImage(img, "PNG", 0, position, w, h);
    heightLeft -= 297;
 
    while (heightLeft > 0) {
      position -= 297;
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, position, w, h);
      heightLeft -= 297;
    }
 
    pdf.save(`Form12C_${id}.pdf`);
 
    el.style.height = origHeight;
    el.style.overflow = origOverflow;
  };
 
  // ===== Loading / No Data =====
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
        <p>No Form 12C data available.</p>
        <button onClick={() => navigate(-1)} className="mt-2 px-4 py-1 bg-gray-300 rounded">
          Close
        </button>
      </div>
    );
  }
 
  // Documents
  const documents: string[] =
    typeof data.upload_document === "string"
      ? data.upload_document.split(",")
      : Array.isArray(data.upload_document)
      ? data.upload_document
      : [];
 
  const signatureUrl = buildFullUrl(data.signature);
 
  // ==========================================================================================
  // VIEW UI — SAME DESIGN AS YOUR EDIT PAGE (TABLE STYLE) BUT PURE READ-ONLY
  // ==========================================================================================
 
  const renderTextCell = (value: any) => (
    <div className="text-right pr-2 text-gray-700">{value || " "}</div>
  );
 
  const renderLeftCell = (label: string) => (
    <div className="text-left text-gray-800">{label}</div>
  );
 
  return (
    <div className="w-full">
      <div className="h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar bg-white rounded-lg shadow p-4 sm:p-6 text-xs sm:text-sm">
 
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Form 12 C</h2>
            <p className="text-xs text-gray-500">Income from House Property</p>
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
 
        {/* ================= TABLE ================= */}
        <div ref={formRef}>
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 border-b px-4 py-2 text-sm font-semibold">
              Details of Income from House Property
            </div>
 
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border px-3 py-2 text-left w-2/5">Particulars</th>
                    <th className="border px-3 py-2 text-center">Self Occupied</th>
                    <th className="border px-3 py-2 text-center">Let Out (House 1)</th>
                    <th className="border px-3 py-2 text-center">Let Out (House 2)</th>
                  </tr>
                </thead>
 
                <tbody>
 
                  {/* ==== MAIN 4 ROWS ==== */}
                  {[
                    {
                      label:
                        "(a) Annual lettable value/or Actual Rent received or receivable whichever is higher(*) for let out properties kept vacant, lettable value or actual rent received or receivable is due to vacancy, the rent received or receivable",
                      self: data.self_alv,
                      lo1: data.lo1_alv,
                      lo2: data.lo2_alv,
                    },
                    {
                      label: "(b) Less: Municipal Taxes paid",
                      self: data.self_municipal_tax,
                      lo1: data.lo1_municipal_tax,
                      lo2: data.lo2_municipal_tax,
                    },
                    {
                      label: "Annual Value (a - b)",
                      self: data.self_annual_value,
                      lo1: data.lo1_annual_value,
                      lo2: data.lo2_annual_value,
                    },
                    {
                      label: "Less: 30% of Annual value (Repairs etc.)",
                      self: data.self_less_30,
                      lo1: data.lo1_less_30,
                      lo2: data.lo2_less_30,
                    },
                  ].map((r, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      <td className="border px-3 py-2 align-top">{renderLeftCell(r.label)}</td>
                      <td className="border px-3 py-2">{renderTextCell(r.self)}</td>
                      <td className="border px-3 py-2">{renderTextCell(r.lo1)}</td>
                      <td className="border px-3 py-2">{renderTextCell(r.lo2)}</td>
                    </tr>
                  ))}
 
                  {/* ===== HOUSE TYPE (just text) ===== */}
                  <tr className="bg-white">
                    <td className="border px-3 py-2 text-gray-800">
                      Select House Type (Self occupied / Let Out-1 / Let Out-2) to identify the housing loan taken from Banks
                    </td>
                    <td className="border px-3 py-2 text-right">{data.house_type_self || "-"}</td>
                    <td className="border px-3 py-2 text-right">{data.house_type_lo1 || "-"}</td>
                    <td className="border px-3 py-2 text-right">{data.house_type_lo2 || "-"}</td>
                  </tr>
 
                  {/* ==== REMAINING 13 ROWS ==== */}
                  {[
                    { label: "Less: Interest on borrowed capital (Banks) for construction / purchase of the above property actuals. Please enclose proof of interest and loan taken with other details.", self: data.self_interest, lo1: data.lo1_interest, lo2: data.lo2_interest },
                    { label: "Loan Date", self: data.self_loan_date, lo1: data.lo1_loan_date, lo2: data.lo2_loan_date },
                    { label: "Less: 1/5th of interest paid for the period before the construction is completed (if any) deductible for 5 years only, attach copy of interest certificate and other relevant papers.", self: data.self_one_fifth_interest, lo1: data.lo1_one_fifth_interest, lo2: data.lo2_one_fifth_interest },
                    { label: "Net Income / (Loss) (as above)", self: data.self_net_income, lo1: data.lo1_net_income, lo2: data.lo2_net_income },
                    { label: "Tax deducted at source on self lease (Enclose copy of certificate(s) issued under Section 203)", self: data.self_tds_self_lease, lo1: data.lo1_tds_self_lease, lo2: data.lo2_tds_self_lease },
                    { label: "CESS on self lease", self: data.self_cess_self_lease, lo1: data.lo1_cess_self_lease, lo2: data.lo2_cess_self_lease },
                    { label: "Capital Gains (No Loss)", self: data.self_capital_gains, lo1: data.lo1_capital_gains, lo2: data.lo2_capital_gains },
                    { label: "Other sources (No Loss) interest / others", self: data.self_other_sources, lo1: data.lo1_other_sources, lo2: data.lo2_other_sources },
                    { label: "Aggregate of items (i) to (iv)", self: data.self_aggregate_items, lo1: data.lo1_aggregate_items, lo2: data.lo2_aggregate_items },
                    { label: "TDS on other income", self: data.self_tds_other_income, lo1: data.lo1_tds_other_income, lo2: data.lo2_tds_other_income },
                    { label: "Cess on other income", self: data.self_cess_other_income, lo1: data.lo1_cess_other_income, lo2: data.lo2_cess_other_income },
                    { label: "Total TDS (a+c)", self: data.self_total_tds, lo1: data.lo1_total_tds, lo2: data.lo2_total_tds },
                    { label: "Total CESS (b+d)", self: data.self_total_cess, lo1: data.lo1_total_cess, lo2: data.lo2_total_cess },
                  ].map((r, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      <td className="border px-3 py-2">{renderLeftCell(r.label)}</td>
                      <td className="border px-3 py-2">{renderTextCell(r.self)}</td>
                      <td className="border px-3 py-2">{renderTextCell(r.lo1)}</td>
                      <td className="border px-3 py-2">{renderTextCell(r.lo2)}</td>
                    </tr>
                  ))}
 
                </tbody>
              </table>
            </div>
          </div>
 
          {/* ================= DOCUMENTS ================= */}
          <div className="border rounded-md p-4 mb-6">
            <p className="font-semibold text-xs mb-2">Uploaded Documents</p>
 
            {documents.length === 0 && <p className="text-xs text-gray-600">No documents uploaded.</p>}
 
            <div className="space-y-2 mt-2">
              {documents.map((d, i) => {
                const url = buildFullUrl(d);
                const filename = d.split("/").pop();
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2"
                  >
                    <span className="text-xs truncate">{filename}</span>
 
                    <div className="flex gap-2">
                      <a href={url} target="_blank" className="text-blue-600 text-xs">
                        Open
                      </a>
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
          </div>
 
          {/* ================= DECLARATION ================= */}
          <div className="mb-6">
            <p className="text-[11px] leading-relaxed">
              ☑ I hereby declare that the information given above is true, complete and correct to the best of my knowledge and belief. I further declare that I shall submit the relevant proofs/documents for the investments and payments declared above as and when required by the company. I understand that any false declaration or withholding of information may result in disciplinary action.
            </p>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="text-[11px]">Place</label>
                <div className="border rounded px-2 py-1 bg-gray-100">{data.declared_place}</div>
              </div>
 
              <div>
                <label className="text-[11px]">Date</label>
                <div className="border rounded px-2 py-1 bg-gray-100">{data.declared_date}</div>
              </div>
            </div>
 
            {/* Signature */}
            <div className="mt-4">
              <label className="text-[11px]">Signature</label>
              <div className="border w-40 h-20 bg-gray-50 flex items-center justify-center mt-1">
                {signatureUrl ? (
                  <img src={signatureUrl} alt="Signature" className="max-h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No signature</span>
                )}
              </div>
              <p className="mt-1 text-xs">{employeeName}</p>
            </div>
          </div>
        </div>
 
        {/* ================= FOOTER ================= */}
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
 
export default Form12CView;