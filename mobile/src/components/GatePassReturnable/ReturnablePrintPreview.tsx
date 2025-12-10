import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "@/api/axiosInstance";
 
const ReturnablePrintPreview: React.FC = () => {
  const { outward_id } = useParams();
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>({});
  const [materials, setMaterials] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any>({});
 
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/api/GatePass/OG/${outward_id}`);
      const data = res.data.data.outward;
 
      setDetails(data);
      setMaterials(res.data.data.materials);
 
      const p = res.data.data.photos[0];
      if (p) {
        setPhotos({
          vehicle: (p.vehicle_photo),
          delivery: (p.delivery_personnel_photo),
          delivery_id: (p.delivery_personnel_id_photo),
          goods: (p.goods_photo),
        });
      }
 
      setLoading(false);
    };
 
    fetchData();
  }, [outward_id]);
 
  const handleDownloadPDF = async () => {
    const element = document.getElementById("outward-preview-root");
    if (!element) return;
 
    const canvas = await html2canvas(element, { scale: 3 });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
 
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
 
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Outward_${details?.gate_pass_no}.pdf`);
  };
 
  const printCSS = `
    @page { size: A4; margin: 8mm; }
    @media print {
      body * { visibility: hidden; }
      #outward-preview-root, #outward-preview-root * { visibility: visible; }
      #outward-preview-root { position: absolute; left: 0; top: 0; width: 100%; }
      .no-print { display: none !important; }
    }
  `;
 
  if (loading) return <div className="p-10 text-center">Loading...</div>;
 
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
      <style>{printCSS}</style>
 
      {/* Header Bar */}
      <div className="no-print flex items-center justify-between bg-gray-100 p-3 border-b">
        <h2 className="text-lg font-semibold">Outward Gate Pass – Print Preview</h2>
 
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
 
      {/* Scrollable Preview */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div
          id="outward-preview-root"
          className="bg-white border border-black mx-auto max-w-3xl p-4 text-[13px]"
        >
 
          {/* Header */}
          <div className="text-center border-b pb-2 mb-3">
            <h1 className="text-xl font-bold">Petronet MHB Limited</h1>
            <p className="font-semibold">OUTWARD GATE PASS</p>
          </div>
 
          {/* Basic Data Table */}
          <table className="w-full border-collapse border border-black text-[12px] mb-4">
            <tbody>
              <tr>
                <td className="border border-black p-2 w-[35%]"><b>Gate Pass No:</b></td>
                <td className="border border-black p-2">{details.gate_pass_no}</td>
                <td className="border border-black p-2 w-[20%]"><b>Date:</b></td>
                <td className="border border-black p-2">
                  {details.date_time?.split("T")[0]}
                </td>
              </tr>
 
              <tr>
                <td className="border border-black p-2"><b>Issued To:</b></td>
                <td className="border border-black p-2">{details.department_contractor_name}</td>
 
                <td className="border border-black p-2"><b>Station:</b></td>
                <td className="border border-black p-2">{details.station}</td>
              </tr>
 
              <tr>
                <td className="border border-black p-2"><b>Purpose:</b></td>
                <td className="border border-black p-2">{details.purpose}</td>
 
                <td className="border border-black p-2"><b>Address:</b></td>
                <td className="border border-black p-2">{details.address}</td>
              </tr>
 
              <tr>
                <td className="border border-black p-2"><b>Vehicle No:</b></td>
                <td className="border border-black p-2">{details.vehicle_no}</td>
 
                <td className="border border-black p-2"><b>Driver Phone:</b></td>
                <td className="border border-black p-2">{details.driver_phone}</td>
              </tr>
 
              <tr>
                <td className="border border-black p-2"><b>Material Taken By:</b></td>
                <td className="border border-black p-2">{details.material_taken_by}</td>
 
                <td className="border border-black p-2"><b>Issuing Authority:</b></td>
                <td className="border border-black p-2">{details.issuing_authority}</td>
              </tr>
            </tbody>
          </table>
 
          {/* Material Table */}
          <h3 className="font-bold mb-1">Materials</h3>
 
          <table className="w-full border-collapse border border-black text-[12px] mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-black p-1 w-[8%]">Sl</th>
                <th className="border border-black p-1">Description</th>
                <th className="border border-black p-1 w-[15%]">Unit</th>
                <th className="border border-black p-1 w-[15%]">Qty</th>
                <th className="border border-black p-1">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m, i) => (
                <tr key={i}>
                  <td className="border border-black p-1 text-center">{i + 1}</td>
                  <td className="border border-black p-1">{m.description}</td>
                  <td className="border border-black p-1 text-center">{m.unit}</td>
                  <td className="border border-black p-1 text-center">{m.quantity}</td>
                  <td className="border border-black p-1">{m.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
 
          {/* Photos Section */}
          <h3 className="font-bold mb-1">Photos</h3>
 
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              ["Vehicle Photo", photos.vehicle],
              ["Personnel Photo", photos.delivery],
              ["ID Proof", photos.delivery_id],
              ["Goods Photo", photos.goods],
            ].map(([label, src], i) => (
              <div key={i}>
                <p className="font-semibold mb-1">{label}</p>
                <img src={src} className="border w-full h-[160px] object-contain" />
              </div>
            ))}
          </div>
 
          {/* Signatures */}
          <table className="w-full border-collapse border border-black text-center text-[12px]">
            <tbody>
              <tr className="bg-gray-200">
                <td className="border border-black p-2">Checked By (Security)</td>
                <td className="border border-black p-2">Approved By</td>
              </tr>
              <tr>
                <td className="border border-black p-6">
                  <b>{details.initiator_name}</b><br />
                  _____________________
                </td>
 
                <td className="border border-black p-6">
                  <b>{details.approver_name}</b><br />
                  _____________________
                </td>
              </tr>
            </tbody>
          </table>
 
        </div>
      </div>
    </div>
  );
};
 
export default ReturnablePrintPreview;