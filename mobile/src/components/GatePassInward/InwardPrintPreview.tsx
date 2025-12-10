import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";

const InwardPrintPreview: React.FC = () => {
  const { inward_id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>({});
  const [materials, setMaterials] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any>({});

  const buildUrl = (path: string) => {
    if (!path) return "";
    const cleaned = path.replace(/\\/g, "/");
    const file = cleaned.substring(cleaned.lastIndexOf("/") + 1);
    return `http://122.166.153.170:8084/files/gate_pass/${file}`;
  };

  /** PDF DOWNLOAD */
  const downloadPDF = async () => {
    const element = document.getElementById("print-content");
    if (!element) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`InwardGatePass_${inward_id}.pdf`);
  };

  /** FETCH DATA */
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/api/GatePass/IG/IGgetby_id/${inward_id}`);
      const data = res.data.get_inward_gate_pass_by_id;

      setDetails(data.inward_details);
      setMaterials(data.materials);

      if (data.photos[0]) {
        const p = data.photos[0];
        setPhotos({
          vehicle: buildUrl(p.vehicle_photo),
          delivery: buildUrl(p.delivery_personnel_photo),
          id: buildUrl(p.delivery_personnel_id_photo),
          goods: buildUrl(p.goods_photo),
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading…</div>;

  /** PRINT CSS */
  const printStyle = `
    @page { size: A4; margin: 8mm; }
    @media print {
      body * { visibility: hidden; }
      #print-content, #print-content * { visibility: visible; }
      #print-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print { display: none !important; }
    }
  `;

  return (
    <div className="w-full bg-gray-100 p-4 min-h-screen">
      <style>{printStyle}</style>

      {/* TOP BUTTONS */}
      <div className="no-print flex justify-end gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
          Back
        </button>
        <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">
          Print
        </button>
        <button onClick={downloadPDF} className="px-4 py-2 bg-green-600 text-white rounded">
          Download PDF
        </button>
      </div>

      {/* PRINT CONTENT */}
      <div
        id="print-content"
        className="bg-white p-6 mx-auto max-w-3xl border shadow text-[13px]"
        style={{ fontFamily: "Arial" }}
      >
        {/* HEADER */}
        <div className="text-center border-b pb-3 mb-4">
          <h1 className="text-xl font-bold">PETRONET MHB LIMITED</h1>
          <p className="font-semibold text-sm">NERIYA INTERMEDIATE PUMPING STATION</p>
          <p className="font-semibold text-sm mt-1 underline">INWARD GATE PASS</p>
        </div>

        {/* BASIC DETAILS TABLE */}
        <table className="w-full border border-black text-sm mb-6">
          <tbody>
            <tr>
              <td className="border p-2 font-semibold w-[30%]">Gate Pass No</td>
              <td className="border p-2">{details.gate_pass_no}</td>
              <td className="border p-2 font-semibold w-[30%]">Date</td>
              <td className="border p-2">{details.date_time?.split("T")[0] || "-"}</td>
            </tr>

            <tr>
              <td className="border p-2 font-semibold">Received From</td>
              <td className="border p-2">{details.received_from}</td>
              <td className="border p-2 font-semibold">Station</td>
              <td className="border p-2">{details.station}</td>
            </tr>

            <tr>
              <td className="border p-2 font-semibold">Supplier Address</td>
              <td colSpan={3} className="border p-2">{details.supplier_address}</td>
            </tr>

            <tr>
              <td className="border p-2 font-semibold">Reference Document</td>
              <td className="border p-2">{details.reference_document}</td>
              <td className="border p-2 font-semibold">Purpose</td>
              <td className="border p-2">{details.purpose}</td>
            </tr>

            <tr>
              <td className="border p-2 font-semibold">Vehicle No</td>
              <td className="border p-2">{details.vehicle_no}</td>
              <td className="border p-2 font-semibold">Driver Name</td>
              <td className="border p-2">{details.driver_name}</td>
            </tr>

            <tr>
              <td className="border p-2 font-semibold">Driver Phone</td>
              <td className="border p-2">{details.driver_phone}</td>
              <td className="border p-2 font-semibold">Security Guard</td>
              <td className="border p-2">{details.security_guard}</td>
            </tr>
          </tbody>
        </table>

        {/* MATERIAL TABLE */}
        <p className="font-bold mb-1">Material Details</p>
        <table className="w-full border border-black text-sm mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Sl No</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Ordered</th>
              <th className="border p-2">Received</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, i) => (
              <tr key={i}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{m.description}</td>
                <td className="border p-2">{m.unit}</td>
                <td className="border p-2">{m.ordered_quantity}</td>
                <td className="border p-2">{m.received_quantity}</td>
                <td className="border p-2">{m.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHOTOS */}
        <p className="font-bold mb-1">Photo Documentation</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold mb-1">Vehicle Photo</p>
            <img src={photos.vehicle} className="border w-full" />
          </div>
          <div>
            <p className="font-semibold mb-1">Delivery Personnel</p>
            <img src={photos.delivery} className="border w-full" />
          </div>
          <div>
            <p className="font-semibold mb-1">ID Proof</p>
            <img src={photos.id} className="border w-full" />
          </div>
          <div>
            <p className="font-semibold mb-1">Goods</p>
            <img src={photos.goods} className="border w-full" />
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-2 gap-8 mt-10 text-sm">
          <div>
            <p><b>Verified By (Security):</b></p>
            <p className="mt-10">_________________________</p>
            <p>{details.security_guard}</p>
          </div>
          <div>
            <p><b>Approved By:</b></p>
            <p className="mt-10">_________________________</p>
            <p>{details.approver_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InwardPrintPreview;
