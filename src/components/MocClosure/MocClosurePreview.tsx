"use client";

import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type MocClosureData = {
  moc_request_no?: string;
  title_of_moc?: string;
  date?: string;
  brief_description?: string;
  moc_initiator_dept?: string;
  executing_dept?: string;
  moc_execution_details?: string;
  job_start_date?: string;
  job_completion_date?: string;
  hira_recommendation_status?: string;
  revised_operating_procedure?: string;
  training_completed?: string;
  relevant_manuals?: string;
  comments_initiator?: string;
};

interface MocClosurePreviewProps {
  data: MocClosureData;
  onBack: () => void;
}

const MocClosurePreview: React.FC<MocClosurePreviewProps> = ({
  data,
  onBack,
}) => {
  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    const element = document.getElementById("moc-closure-preview-root");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`MOC_Closure_${data?.moc_request_no || "Preview"}.pdf`);
  };

  const printStyle = `
    @page { size: A4; margin: 10mm; }
    @media print {
      body * { visibility: hidden !important; }
      #moc-closure-preview-root, #moc-closure-preview-root * { visibility: visible !important; }
      #moc-closure-preview-root { position: absolute; left: 0; top: 0; width: 100%; }
      .no-print { display: none !important; }
    }
  `;

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[85vh]">
      <style>{printStyle}</style>

      {/* Header Buttons */}
      <div className="no-print flex items-center justify-between bg-gray-50 p-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          MOC Closure Print Preview
        </h2>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 border rounded-md">
            ← Back
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            🖨 Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            ⬇ Download
          </button>
        </div>
      </div>

      {/* Printable Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          id="moc-closure-preview-root"
          className="bg-white border border-black mx-auto max-w-4xl text-[12px] leading-[1.2]"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {/* --- Header Section --- */}
          <table className="w-full border-collapse border border-black text-[12px]">
            <tbody>
              <tr>
                <td rowSpan={3} className="border border-black text-center w-[15%]">
                  <img
                    src="/assets/images/companylogo.png"
                    alt="logo"
                    className="h-12 mx-auto my-1"
                  />
                </td>
                <td colSpan={3} className="border border-black text-center font-bold">
                  PETRONET MHB LIMITED
                </td>
                <td className="border border-black font-bold text-xs p-1">
                  <div>Doc. No.: IMS/MOC/F-02</div>
                  <div>Rev No.: 01</div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black text-center font-semibold">
                  Management of Change
                </td>
                <td className="border border-black font-bold text-xs p-1">
                  <div>Issue No.: 01</div>
                  <div>Issue Date: 10.01.2024</div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-black text-center font-semibold text-xs">
                  TYPICAL MOC CLOSURE FORM
                </td>
                <td className="border border-black text-center font-bold text-xs">
                  Page 1 of 1
                </td>
              </tr>
            </tbody>
          </table>

          {/* --- Form Body --- */}
          <table className="w-full border-collapse border border-black mt-0">
            <tbody>
              <tr>
                <td className="border border-black font-bold px-2 py-1 w-[25%]">
                  1. Title of Proposal:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.title_of_moc || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  2. MOC No.:
                </td>
                <td className="border border-black px-2 py-1 w-[25%]">
                  {data?.moc_request_no || ""}
                </td>
                <td className="border border-black font-bold px-2 py-1">
                  Date:
                </td>
                <td colSpan={2} className="border border-black px-2 py-1">
                  {data?.date || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  3. Brief Description:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.brief_description || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  4. MoC Initiator Department:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.moc_initiator_dept || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  5. Executing Department:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.executing_dept || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  6. MoC Execution Details:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.moc_execution_details || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  7. Job Start Date:
                </td>
                <td className="border border-black px-2 py-1">
                  {data?.job_start_date || ""}
                </td>
                <td className="border border-black font-bold px-2 py-1">
                  Job Completion Date:
                </td>
                <td colSpan={2} className="border border-black px-2 py-1">
                  {data?.job_completion_date || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  8. All HIRA recommendation closed:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.hira_recommendation_status || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  9. Revised operating procedure prepared:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.revised_operating_procedure || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  10. Training of concern person completed:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.training_completed || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  11. Relevant Manual / P&ID / Other docs:
                </td>
                <td colSpan={4} className="border border-black px-2 py-1">
                  {data?.relevant_manuals || ""}
                </td>
              </tr>

              <tr>
                <td className="border border-black font-bold px-2 py-1">
                  12. Comments (Initiator):
                </td>
                <td colSpan={4} className="border border-black px-2 py-4">
                  {data?.comments_initiator || ""}
                 
                </td>
              </tr>
            </tbody>
          </table>

          {/* --- Signature Section --- */}
          <div className="h-8"></div> {/* Extra space for signatures above footer */}

          <table className="w-full border-collapse border border-black text-center text-[11px] font-semibold">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border border-black py-1">Execution Department</td>
                <td className="border border-black py-1">Acceptance By</td>
                <td className="border border-black py-1">Initiator</td>
              </tr>
              <tr>
                <td className="border border-black py-6">
                  Signature: ______________________
                  <br />
                  Name: <b></b>
                  <br />
                  Designation: 
                </td>
                <td className="border border-black py-6">
                  Signature: ______________________
                  <br />
                  Name: <b></b>
                  <br />
                  Designation:
                </td>
                <td className="border border-black py-6">
                  Signature: ______________________
                  <br />
                  Name: <b></b>
                  <br />
                  Designation:
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MocClosurePreview;

 
 