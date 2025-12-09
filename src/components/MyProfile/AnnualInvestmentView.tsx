// AnnualInvestmentView.tsx
import React, { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import api from "@/api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
 
interface AnnualInvestmentProps {
  isActive?: boolean; // optional so it can be used standalone too
  onCancel?: () => void;
}
 
const AnnualInvestmentView: React.FC<AnnualInvestmentProps> = ({ isActive = true, onCancel }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = React.useRef<HTMLDivElement>(null);
 
  const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userData") || "{}") : {};
  const employeeName = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim();
 
  const buildFullUrl = (maybePath: string | undefined) => {
    if (!maybePath) return undefined;
    if (maybePath.startsWith("http")) return maybePath;
    const base = api.defaults.baseURL?.replace(/\/+$/, "") ?? "";
    return `${base}/${maybePath}`.replace(/\\/g, "/");
  };
 
  const fetchFinanceDetailsById = async (financeId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/finance/${financeId}`);
      setData(res.data);
    } catch (err) {
      console.error("fetchFinanceById:", err);
      toast.error("Failed to fetch record.");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchFinanceForUser = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("userData");
      const userId = stored ? JSON.parse(stored)?.userId : null;
      if (!userId) {
        toast.error("User not found in localStorage");
        setLoading(false);
        return;
      }
      const res = await api.get(`/api/finance/user/${userId}`);
      const arr = res.data;
      if (Array.isArray(arr) && arr.length) {
        setData(arr[0]);
      } else {
        toast.info("No Annual Investment record found for you.");
        setData(null);
      }
    } catch (err) {
      console.error("fetchFinanceForUser:", err);
      toast.error("Failed to fetch your Annual Investment.");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (!isActive) return;
    if (id) {
      fetchFinanceDetailsById(id);
    } else {
      fetchFinanceForUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isActive]);
 
  const handleDownloadDocument = async (docUrl: string | undefined) => {
    if (!docUrl) return;
    try {
      const full = buildFullUrl(docUrl) ?? docUrl;
      const res = await fetch(full);
      const blob = await res.blob();
      const filename = (docUrl || "").split("/").pop() || "document";
      saveAs(blob, filename);
    } catch (err) {
      console.error("download error", err);
      toast.error("Unable to download document.");
    }
  };
 
 
 
const handleDownloadPDF = async () => {
  if (!formRef.current) return;
 
  const el = formRef.current;
 
  // === 1. Expand scrollable div ===
  const originalHeight = el.style.height;
  const originalOverflow = el.style.overflow;
  el.style.height = "auto";
  el.style.overflow = "visible";
 
  await new Promise((resolve) => setTimeout(resolve, 200));
 
  // === 2. Capture Full Document ===
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: -window.scrollY
  });
 
  const imgData = canvas.toDataURL("image/png");
 
  // === 3. Prepare PDF ===
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
 
  const ratio = canvas.width / canvas.height;
  const pdfWidth = pageWidth;
  const pdfHeight = pdfWidth / ratio;
 
  let heightLeft = pdfHeight;
  let yPos = 0;
 
  // === 4. First Page ===
  pdf.addImage(imgData, "PNG", 0, yPos, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;
 
  // === 5. Additional pages ===
  while (heightLeft > 0) {
    yPos -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, yPos, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }
 
  pdf.save(`Annual_Investment_${data?.financial_year || ""}.pdf`);
 
  // === 6. Restore ===
  el.style.height = originalHeight;
  el.style.overflow = originalOverflow;
};
 
 
 
 
  if (!isActive) return null;
 
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
 
  if (!data) {
    return (
      <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-3">No Annual Investment data available.</p>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
          <button
            onClick={() => fetchFinanceForUser()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
 
  // Safe getters
  const signatureUrl = buildFullUrl(data.signature_name);
  const documents: string[] = Array.isArray(data.upload_document) ? data.upload_document : [];
 
  return (
    <div className="w-full">
      {/* Header */}
     {/* Header */}
<div className="bg-[#1447B2] text-white p-4 rounded-lg shadow mb-4 flex items-center justify-between">
 
  <div>
    <h2 className="text-lg font-semibold">Employee Personal Information</h2>
    <p className="text-xs opacity-90">Your basic information</p>
  </div>
 
  {/* HEADER BUTTONS */}
  <div className="flex items-center gap-2">
    <button
      onClick={handleDownloadPDF}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
    >
      Download PDF
    </button>
 
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-xs"
    >
      <Printer size={14} /> Print
    </button>
  </div>
</div>
 
 
      {/* Scrollable content */}
     <div
  ref={formRef}
 
  className="h-[calc(100vh-200px)] overflow-y-auto bg-white rounded-lg hide-scrollbar shadow p-4 sm:p-6 text-xs sm:text-sm"
>
        <div className="space-y-6">
 
       
          <div className="border-b pb-3">
            <h2 className="text-base font-semibold text-[#1447B2]">
              Annual Investment for Tax Deduction
            </h2>
            <p className="text-[11px] text-gray-600">Declare your tax-saving investments for the chosen financial year.</p>
          </div>
 
         
          <Section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <ReadonlyField label="Date" value={data.date} />
              <ReadonlyField label="Financial Year" value={data.financial_year} />
              <ReadonlyField label="Opting for Concessional Rate (Section 115 BAC)" value={data.opting_for_concessional_rate} />
            </div>
          </Section>
 
         
          <Section title="Rent Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <ReadonlyField label="Residing in Rented House" value={data.residing_in_rented_house} />
              <ReadonlyField label="Monthly Rent (₹)" value={data.monthly_rent} />
              <ReadonlyField label="Landlord Name" value={data.landlord_name} />
              <ReadonlyField label="Temporary Address" value={data.temporary_address} textArea />
            </div>
          </Section>
 
         
          <Section title="Investment under Section 80C">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <ReadonlyField label="Pension Plan (₹)" value={data.pension_plan} />
              <ReadonlyField label="LIC Premium (₹)" value={data.lic_premium} />
              <ReadonlyField label="PPF (₹)" value={data.ppf} />
              <ReadonlyField label="ULIP (₹)" value={data.ulip} />
              <ReadonlyField label="Tuition Fees for Children (₹)" value={data.tuition_fees} />
              <ReadonlyField label="NSC (₹)" value={data.nsc} />
              <ReadonlyField label="NSC Interest (₹)" value={data.nsc_interest} />
              <ReadonlyField label="Housing Loan Repayment (₹)" value={data.housing_loan_repayment} />
              <ReadonlyField label="Other Investments under 80C (₹)" value={data.other_investments} />
            </div>
          </Section>
 
         
          <Section title="Total investment under 80C">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <ReadonlyField label="Infrastructure Bond (₹)" value={data.infrastructure_bond} />
              <ReadonlyField label="Educational Loan Interest (₹)" value={data.educational_loan_interest} />
              <ReadonlyField label="Contribution to NPS Deduction (₹)" value={data.contribution_to_nps} />
            </div>
          </Section>
 
     
          <Section title="Uploaded Documents">
            <div className="space-y-2">
              {documents.length === 0 && <p className="text-sm text-gray-600">No documents uploaded.</p>}
              {documents.map((d, i) => {
                const url = buildFullUrl(d);
                const filename = d?.split?.("/")?.pop() || `document-${i + 1}`;
                return (
                  <div key={i} className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2">
                    <div className="text-xs text-gray-700 truncate max-w-[70%]">{filename}</div>
                    <div className="flex gap-2 items-center">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Open
                        </a>
                      ) : null}
                      <button
                        onClick={() => handleDownloadDocument(d)}
                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
 
         
          <Section>
            <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.declaration_text || "I hereby declare that what is stated above is true to the best of my knowledge..."}
            </p>
          </Section>
 
         
          <Section title="Signature">
            <div className="flex items-start gap-4">
              <div className="border p-2 w-40 h-20 flex items-center justify-center bg-gray-50">
                {signatureUrl ? (
                  <img src={signatureUrl} alt="Signature" className="max-h-full object-contain" />
                ) : (
                  <span className="text-xs text-gray-400">No signature</span>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-700">{employeeName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {data.signature_name && !data.signature_name.startsWith("http") ? "(hosted on server)" : ""}
                </div>
              </div>
            </div>
          </Section>
               
    <div className="flex justify-end gap-3 mt-4 border-t pt-4 bg-[#F4F7FF] p-3 rounded">
 
 
 
  <button
    onClick={() => onCancel ? onCancel() : navigate(-1)}
    className="px-5 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
  >
    Close
  </button>
 
</div>
 
        </div>
      </div>
 
 
    </div>
  );
};
 
export default AnnualInvestmentView;
 
/* -------------------------
   Small helpers (local)
------------------------- */
const Section = ({ children, title }: { children: any; title?: string }) => (
  <div className="border rounded p-4 bg-gray-50 space-y-2">
    {title && <h3 className="font-semibold text-[12px] text-gray-700">{title}</h3>}
    {children}
  </div>
);
 
const ReadonlyField = ({ label, value, textArea = false }: { label: string; value: any; textArea?: boolean }) => (
  <div>
    <label className="block text-[11px] mb-1 font-medium text-gray-700">{label}</label>
    {textArea ? (
      <textarea readOnly value={value || ""} className="w-full border rounded px-2 py-1 bg-gray-100 min-h-[45px]" />
    ) : (
      <input readOnly value={value || ""} className="w-full border rounded px-2 py-1 bg-gray-100" />
    )}
  </div>
);
 
 
 
 