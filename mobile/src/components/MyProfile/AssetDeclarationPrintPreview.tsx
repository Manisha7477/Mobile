import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "@/api/axiosInstance";

const AssetDeclarationPrintPreview: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { id } = useParams();
  const year = params.get("year") ?? "";
  const [loading, setLoading] = useState(true);
  const [immovable, setImmovable] = useState<any[]>([]);
  const [movable, setMovable] = useState<any[]>([]);
  const [details, setDetails] = useState<any>({});
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const storedUser = localStorage.getItem('userData');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("userData");
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        const userId = parsed?.userId;
        if (!userId) return;
        const res = await api.get(`/api/usersProfile/${userId}`);
        setDetails((prev: any) => ({
          ...prev,
          employee_designation: res.data.designation,
          grade: res.data.grade,
          stationName: res.data.station_name
        }));

      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const res = await api.get(`/api/asset-declaration/user/${id}`);
      const all = res.data;
      let yearParam = params.get("year");
      if (!yearParam) {
        yearParam = all[0]?.financial_year;
      }
      const rows = all.filter((a: { financial_year: string | null; }) => a.financial_year === yearParam);
      setImmovable(rows.filter((i: { asset_type: string; }) => i.asset_type === "Immovable Property"));
      setMovable(rows.filter((i: { asset_type: string; }) => i.asset_type === "Movable Property"));
      const first = rows[0] ?? {};
      setDetails((prev: { employee_designation: any; }) => ({
        ...prev,
        date: first.date,
        financial_year: first.financial_year,
        employee_name: first.employee_full_name ?? "",
        employee_designation: prev.employee_designation || first.designation || "",
        employee_location: first.station_name ?? parsedUser?.stationName ?? "",

        employee_id: id
      }));
      setSignatureUrl(first.signature ?? null);
      setLoading(false);
    };
    fetchData();
  }, [id, params]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("asset-preview-root");
    if (!element) return;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true
    });
    const pdf = new jsPDF("p", "mm", "a4");
    const img = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Asset_Declaration_${year}.pdf`);
  };

  const printCSS = `
    @page { size: A4; margin: 8mm; }
    @media print {
      body * { visibility: hidden; }
      #asset-preview-root, #asset-preview-root * { visibility: visible; }
      #asset-preview-root { position: absolute; left: 0; top: 0; width: 100%; }
      .no-print { display: none !important; }
    }
  `;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
      <style>{printCSS}</style>
      <div className="no-print flex items-center justify-between bg-gray-100 p-3 border-b">
        <h2 className="text-lg font-semibold">Asset Declaration – Print Preview</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-md">
            ← Back
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            🖨 Print
          </button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-600 text-white rounded-md">
            ⬇ Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div
          id="asset-preview-root"
          className="bg-white border border-black mx-auto max-w-4xl p-4 text-[12px]"
        >
          <div className="text-center border-b pb-2 mb-3">
            <img src="/companylogo.png" alt="Company Logo" className="w-40 mx-auto mb-2" />
            <h1 className="text-xl font-bold">Petronet MHB Limited</h1>
            <p className="font-semibold underline">Asset Declaration</p>
            <p className="text-[11px] mt-1">
              (Declaration required for all movable/immovable properties acquired during the financial year)
            </p>
          </div>
          <table className="w-full border border-black border-collapse text-[12px] mb-4">
            <tbody>
              <tr>
                <td className="border p-2 font-bold w-[25%]">Employee Name</td>
                <td className="border p-2">{details.employee_name}</td>
                <td className="border p-2 font-bold w-[25%]">Financial Year</td>
                <td className="border p-2">{details.financial_year}</td>
                <td className="border p-2 font-bold w-[25%]">Location</td>
                <td className="border p-2">{details.employee_location}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Employee Designation</td>
                <td className="border p-2">{details.employee_designation}</td>
                <td className="border p-2 font-bold">Employee Grade</td>
                <td className="border p-2">{details.grade}</td>
              </tr>
            </tbody>
          </table>
          <h3 className="font-bold mb-1">Immovable Property</h3>
          <table className="w-full border-collapse border border-black text-[11px] mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-1">Sl</th>
                <th className="border p-1">Details</th>
                <th className="border p-1">Held In Name</th>
                <th className="border p-1">Date of Acquisition</th>
                <th className="border p-1">Nature</th>
                <th className="border p-1">Party</th>
                <th className="border p-1">Finance</th>
                <th className="border p-1">Source</th>
                <th className="border p-1">Profit</th>
              </tr>
            </thead>
            <tbody>
              {immovable.map((row, i) => (
                <tr key={i}>
                  <td className="border p-1 text-center">{i + 1}</td>
                  <td className="border p-1">{row.details}</td>
                  <td className="border p-1">{row.held_in_name}</td>
                  <td className="border p-1">{row.acquisition_date}</td>
                  <td className="border p-1">{row.nature}</td>
                  <td className="border p-1">{row.party}</td>
                  <td className="border p-1">{row.finance_amount}</td>
                  <td className="border p-1">{row.source_of_finance}</td>
                  <td className="border p-1">{row.profit_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="font-bold mb-1">
            Movable Property (Purchased/Sold  Rs. 20000)
          </h3>
          <table className="w-full border-collapse border border-black text-[11px] mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-1">Sl</th>
                <th className="border p-1">Details</th>
                <th className="border p-1">Held In Name</th>
                <th className="border p-1">Date of Acquisition</th>
                <th className="border p-1">Nature</th>
                <th className="border p-1">Party</th>
                <th className="border p-1">Finance</th>
                <th className="border p-1">Source</th>
                <th className="border p-1">Profit</th>
              </tr>
            </thead>
            <tbody>
              {movable.map((row, i) => (
                <tr key={i}>
                  <td className="border p-1 text-center">{i + 1}</td>
                  <td className="border p-1">{row.details}</td>
                  <td className="border p-1">{row.held_in_name}</td>
                  <td className="border p-1">{row.acquisition_date}</td>
                  <td className="border p-1">{row.nature}</td>
                  <td className="border p-1">{row.party}</td>
                  <td className="border p-1">{row.finance_amount}</td>
                  <td className="border p-1">{row.source_of_finance}</td>
                  <td className="border p-1">{row.profit_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-10 px-4 text-[12px]">
            <p><b>Date:</b> {details.date?.split("T")[0]}</p>
            <div className="text-center">
              <p className="font-semibold">Signature:</p>
              {signatureUrl ? (
                <img src={signatureUrl} className="w-40 border mt-1" />
              ) : (
                <p>No signature uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDeclarationPrintPreview;