// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// type MocFormData = {
//     docNo?: string;
//     revNo?: string;
//     issueNo?: string;
//     issueDate?: string;
//     page?: string;
//     title?: string;
//     mocNo?: string;
//     date?: string;
//     priority?: string;
//     modificationType?: string;
//     shutdownRequired?: string;
//     timeLimit?: string;
//     presentSystem?: string;
//     proposedChange?: string;
//     additionalAdditorsIfAny?: string;
//     upstreamDownstreamImpact?: string;
//     detailsIfAny?: string;
//     statutoryApprovalRequired?: string;
//     statutoryDetails?: string;
//     objectives?: string;
//     impactOfModification?: string;
//     consequencesOfNonImplementation?: string;
//     safetyOfProposedChange?: string;
//     healthSafety?: string;
//     efficiency?: string;
//     qualityEnergy?: string;
//     reliabilityImprovement?: string;
//     anyOtherAspect?: string;
//     hiraAttached?: string;
//     objectivesOfMocHaveBeenMet?: string;
//     comments1?: string;
//     comments2?: string;
//     comments3?: string;
//     preparedByName?: string;
//     preparedByDesignation?: string;
//     reviewedByName?: string;
//     reviewedByDesignation?: string;
//     approvedByName?: string;
//     approvedByDesignation?: string;
// };

// const defaultData: MocFormData = {
//     docNo: "IMS/MOC/FILTER",
//     revNo: "01",
//     issueNo: "01",
//     issueDate: "10.01.2024",
//     page: "1 of 2",
//     title: "Installation of New Filtration System",
//     mocNo: "MOC/2024/001",
//     date: "15.03.2024",
//     priority: "Normal",
//     modificationType: "Permanent",
//     shutdownRequired: "Yes",
//     timeLimit: "N/A",
//     presentSystem: "Current system uses outdated filtration technology with limited capacity and high maintenance requirements.",
//     proposedChange: "Install advanced membrane filtration system with automated controls and higher throughput capacity.",
//     additionalAdditorsIfAny: "Additional safety interlocks and monitoring sensors to be installed.",
//     upstreamDownstreamImpact: "Yes",
//     detailsIfAny: "Upstream pressure adjustments required. Downstream storage tanks need to be upgraded.",
//     statutoryApprovalRequired: "Yes",
//     statutoryDetails: "Environmental clearance from State Pollution Control Board required.",
//     objectives: "Improve filtration efficiency, reduce maintenance downtime, enhance product quality, and comply with new regulatory standards.",
//     impactOfModification: "Positive impact on production efficiency, product quality, and operational safety.",
//     consequencesOfNonImplementation: "Continued operational inefficiencies, increased maintenance costs, potential regulatory non-compliance, and safety risks.",
//     safetyOfProposedChange: "Enhanced safety features including emergency shutdown systems and leak detection.",
//     healthSafety: "Yes",
//     efficiency: "Yes",
//     qualityEnergy: "Yes",
//     reliabilityImprovement: "Yes",
//     anyOtherAspect: "Yes",
//     hiraAttached: "Yes",
//     objectivesOfMocHaveBeenMet: "To be evaluated post-implementation",
//     comments1: "Project timeline: 6 weeks. Budget approved: $250,000",
//     comments2: "Training sessions scheduled for all operators before commissioning",
//     comments3: "Contingency plans prepared for emergency situations during installation",
//     preparedByName: "John Smith",
//     preparedByDesignation: "Process Engineer",
//     reviewedByName: "Sarah Johnson",
//     reviewedByDesignation: "Operations Manager",
//     approvedByName: "Michael Brown",
//     approvedByDesignation: "Plant Manager"
// };

// export default function MocPreviewPage() {
//     const [data, setData] = useState<MocFormData>(defaultData);
//     const [loaded, setLoaded] = useState(false);
//     const navigate = useNavigate();


//     useEffect(() => {
//         setLoaded(true);
//     }, []);

//     const printStyle = `
//         @page {
//             size: A4;
//             margin: 15mm;
//         }

//         @media print {
//             body * {
//                 visibility: hidden !important;
//             }
//             #moc-preview-root, #moc-preview-root * {
//                 visibility: visible !important;
//             }
//             #moc-preview-root {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 max-height: none !important;
//                 overflow: visible !important;
//             }
//             .no-print {
//                 display: none !important;
//             }
//             .print-container {
//                 max-height: none !important;
//                 overflow: visible !important;
//             }
//         }
//     `;

//     const handlePrint = () => {
//         window.print();
//     };

//    const handleBack = () => {
//     navigate("/line/ReviewMocRequest", { state: { formData: data } });
//   };

//     if (!loaded) return null;

//     return (
//         <div className="min-h-screen bg-gray-100 py-6 px-4">
//             <style>{printStyle}</style>

//             {/* Header Buttons */}
//             <div className="no-print max-w-full mx-auto mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
//                 <h2 className="text-xl font-semibold text-gray-800">MOC — Print Preview</h2>
//                 <div className="flex gap-3">
//                     <button
//                         onClick={handleBack}
//                         className="px-5 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium"
//                     >
//                         ← Back to Form
//                     </button>
//                     <button
//                         onClick={handlePrint}
//                         className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
//                     >
//                         🖨️ Print
//                     </button>
//                 </div>
//             </div>

//             {/* PRINT AREA */}
//             <div className="w-full mx-auto px-4" style={{ maxHeight: "calc(100vh - 170px)", overflowY: "auto" }}>
//                 <div
//                     id="moc-preview-root"
//                     className="print-container bg-white border border-black shadow-lg mx-auto"
//                     style={{
//                         fontFamily: "Arial, sans-serif",
//                     }}
//                 >
//                     {/* Header Section */}
//                     <table className="w-full border-collapse">
//                         <tbody>
//                             <tr>
//                                 <td
//                                     rowSpan={3}
//                                     className="border border-black text-center align-middle"
//                                     style={{ width: "12%", padding: "4px" }}
//                                 >
//                                     <div className="flex items-center justify-center">
//                                         <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs font-bold">
//                                             LOGO
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td
//                                     colSpan={3}
//                                     className="border border-black text-center font-bold"
//                                     style={{ width: "76%", padding: "6px", fontSize: "13px" }}
//                                 >
//                                     TYPICAL MOC REQUEST & APPROVAL FORM
//                                 </td>
//                                 <td
//                                     className="border border-black font-bold"
//                                     style={{ width: "16%", padding: "2px 4px", fontSize: "11px" }}
//                                 >
//                                     <div>Doc. No.: {data.docNo || ""}</div>
//                                     <div>Rev No.: {data.revNo || ""}</div>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td
//                                     colSpan={3}
//                                     className="border border-black text-center"
//                                     style={{ padding: "2px", fontSize: "13px" }}
//                                 >
//                                     <div className="font-bold">Management of Change</div>
//                                 </td>
//                                 <td
//                                     className="border border-black font-bold"
//                                     style={{ padding: "2px 4px", fontSize: "11px" }}
//                                 >
//                                     <div>Issue No.: {data.issueNo || ""}</div>
//                                     <div>Issue Date: {data.issueDate || ""}</div>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td
//                                     colSpan={3}
//                                     className="border border-black text-center"
//                                     style={{ padding: "2px", fontSize: "11px" }}
//                                 >
//                                     <div className="font-semibold">Page: {data.page || ""}</div>
//                                 </td>
//                                 <td
//                                     className="border border-black text-center font-bold"
//                                     style={{ padding: "2px", fontSize: "11px" }}
//                                 >
//                                     Controlled
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>

//                     {/* Form Content */}
//                     <table className="w-full border-collapse" style={{ fontSize: "12px" }}>
//                         <tbody>
//                             {/* Row 1 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" style={{ width: "25%" }}>
//                                     1. Title of the MOC:
//                                 </td>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={3}>
//                                     {data.title || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 2 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold">2. MOC No:</td>
//                                 <td className="border border-black px-1 py-1" style={{ width: "25%" }}>
//                                     {data.mocNo || ""}
//                                 </td>
//                                 <td className="border border-black px-1 py-1 font-bold" style={{ width: "25%" }}>
//                                     Date:
//                                 </td>
//                                 <td className="border border-black px-1 py-1" style={{ width: "25%" }}>
//                                     {data.date || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 3 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold">3. Priority:</td>
//                                 <td className="border border-black px-1 py-1">
//                                     {data.priority || ""}
//                                 </td>
//                                 <td className="border border-black px-1 py-1 font-bold">Modification type:</td>
//                                 <td className="border border-black px-1 py-1">
//                                     {data.modificationType || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 4 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold">Normal</td>
//                                 <td className="border border-black px-1 py-1"></td>
//                                 <td className="border border-black px-1 py-1 font-bold">Permanent</td>
//                                 <td className="border border-black px-1 py-1 font-bold">Shut down required:</td>
//                             </tr>

//                             {/* Row 5 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold">Urgent</td>
//                                 <td className="border border-black px-1 py-1"></td>
//                                 <td className="border border-black px-1 py-1 font-bold">Temporary</td>
//                                 <td className="border border-black px-1 py-1">{data.shutdownRequired || ""}</td>
//                             </tr>

//                             {/* Row 6 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     4. Time limit in case of temporary modification:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.timeLimit || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 7 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     5. Present system and proposed change with detail of modification involves (Addition/ deletion/ modification):
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     <div className="whitespace-pre-wrap">
//                                         <strong>Present:</strong> {data.presentSystem || ""}
//                                         {"\n\n"}
//                                         <strong>Proposed:</strong> {data.proposedChange || ""}
//                                         {data.additionalAdditorsIfAny && `\n\n${data.additionalAdditorsIfAny}`}
//                                     </div>
//                                 </td>
//                             </tr>

//                             {/* Row 8 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     6. Justification/reason for the modification:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.objectives || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 9 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
//                                     7. Whether upstream or downstream units are
//                                 </td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">Yes</td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">No</td>
//                             </tr>

//                             {/* Row 10 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     also impacted during implementation of
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     Details for SI No 7 if any:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.detailsIfAny || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 11 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     8. Objective/Benefit of the proposal:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.objectives || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 12 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     9. Is any statutory approval is required for the
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     If yes, please give details:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.statutoryApprovalRequired === "Yes" ? data.statutoryDetails : ""}
//                                 </td>
//                             </tr>

//                             {/* Row 13 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     10 A. Impact of modification:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.impactOfModification || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 14 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     10 B. Consequences of non-implementation:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.consequencesOfNonImplementation || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 15 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     11. Impact of the proposed change on :
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.safetyOfProposedChange || ""}
//                                 </td>
//                             </tr>

//                             {/* Row 16 - Checklist */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
//                                     a. Health, Safety & Environment
//                                 </td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">Yes</td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">No</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
//                                     b. Efficiency and operability
//                                 </td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">Yes</td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">No</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
//                                     c. Quality, Energy conservation and profit margin
//                                 </td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">Yes</td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">No</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
//                                     d. Reliability (Improvement of the plant
//                                 </td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">Yes</td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">No</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
//                                     e. Any other aspect
//                                 </td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">Yes</td>
//                                 <td className="border border-black px-1 py-1 text-center font-bold">No</td>
//                             </tr>

//                             {/* Row 17 */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     Quality:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     12. Whether HIRA has been done, if yes, attached the report:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.hiraAttached || ""}
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
//                                     13. Whether objectives of MOC have been met:
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" colSpan={4}>
//                                     {data.objectivesOfMocHaveBeenMet || ""}
//                                 </td>
//                             </tr>

//                             {/* Comments Section */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold">Comments:</td>
//                                 <td className="border border-black px-1 py-1 font-bold">Comments:</td>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>Comments:</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" style={{ minHeight: "60px" }}>
//                                     <div className="whitespace-pre-wrap">{data.comments1 || ""}</div>
//                                 </td>
//                                 <td className="border border-black px-1 py-2">
//                                     <div className="whitespace-pre-wrap">{data.comments2 || ""}</div>
//                                 </td>
//                                 <td className="border border-black px-1 py-2" colSpan={2}>
//                                     <div className="whitespace-pre-wrap">{data.comments3 || ""}</div>
//                                 </td>
//                             </tr>

//                             {/* Signature Section */}
//                             <tr>
//                                 <td className="border border-black px-1 py-1 font-bold">Prepared By</td>
//                                 <td className="border border-black px-1 py-1 font-bold">Reviewed By</td>
//                                 <td className="border border-black px-1 py-1 font-bold" colSpan={2}>Approved By</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1">Name:</td>
//                                 <td className="border border-black px-1 py-1">Name:</td>
//                                 <td className="border border-black px-1 py-1" colSpan={2}>Name:</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" style={{ minHeight: "30px" }}>
//                                     {data.preparedByName || ""}
//                                 </td>
//                                 <td className="border border-black px-1 py-2">
//                                     {data.reviewedByName || ""}
//                                 </td>
//                                 <td className="border border-black px-1 py-2" colSpan={2}>
//                                     {data.approvedByName || ""}
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-1">Designation:</td>
//                                 <td className="border border-black px-1 py-1">Designation:</td>
//                                 <td className="border border-black px-1 py-1" colSpan={2}>Designation:</td>
//                             </tr>
//                             <tr>
//                                 <td className="border border-black px-1 py-2" style={{ minHeight: "30px" }}>
//                                     {data.preparedByDesignation || ""}
//                                 </td>
//                                 <td className="border border-black px-1 py-2">
//                                     {data.reviewedByDesignation || ""}
//                                 </td>
//                                 <td className="border border-black px-1 py-2" colSpan={2}>
//                                     {data.approvedByDesignation || ""}
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type MocFormData = {
    docNo?: string;
    revNo?: string;
    issueNo?: string;
    issueDate?: string;
    page?: string;
    title?: string;
    mocNo?: string;
    stationName?: string;
    date?: string;
    priority?: string;
    modificationType?: string;
    shutdownRequired?: string;
    timeLimit?: string;
    presentSystem?: string;
    proposedChange?: string;
    additionalAdditorsIfAny?: string;
    upstreamDownstreamImpact?: string;
    detailsIfAny?: string;
    statutoryApprovalRequired?: string;
    statutoryDetails?: string;
    objectives?: string;
    impactOfModification?: string;
    consequencesOfNonImplementation?: string;
    safetyOfProposedChange?: string;
    healthSafety?: string;
    efficiency?: string;
    qualityEnergy?: string;
    reliabilityImprovement?: string;
    anyOtherAspect?: string;
    hiraAttached?: string;
    objectivesOfMocHaveBeenMet?: string;
    comments1?: string;
    comments2?: string;
    comments3?: string;
    preparedByName?: string;
    preparedByDesignation?: string;
    reviewedByName?: string;
    reviewedByDesignation?: string;
    approvedByName?: string;
    approvedByDesignation?: string;
};

interface MocPreviewProps {
    data: MocFormData;
    onBack: () => void;
}


const MocPreview: React.FC<MocPreviewProps> = ({ data, onBack }) => {
    const handlePrint = () => {
        window.print();
    };


    // ✅ Download PDF with better styling and fit-to-A4
    const handleDownloadPDF = async () => {
        const element = document.getElementById("moc-preview-root");
        if (!element) return;

        // Apply temporary white background & padding for clean export
        element.style.background = "#ffffff";
        element.style.padding = "20px";

        // Convert HTML to Canvas (hi-res)
        const canvas = await html2canvas(element, {
            scale: 3, // higher = sharper text
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            scrollY: -window.scrollY, // avoid scroll offset
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Calculate proper image sizing
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add the first page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Handle multi-page content
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // Save with clean name
        pdf.save(`MOC_Form_${data?.mocNo || "Preview"}.pdf`);

        // Reset element styling (important)
        element.style.background = "";
        element.style.padding = "";
    };

    const printStyle = `
        @page {
            size: A4;
            margin: 15mm;
        }
        
        @media print {
            body * {
                visibility: hidden !important;
            }
            #moc-preview-root, #moc-preview-root * {
                visibility: visible !important;
            }
            #moc-preview-root {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-height: none !important;
                overflow: visible !important;
            }
            .no-print {
                display: none !important;
            }
            .print-container {
                max-height: none !important;
                overflow: visible !important;
            }
        }
    `;

    return (
        <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[75vh] max-h-[64vh]">
            <style>{printStyle}</style>

            {/* Header Buttons */}
            <div className="no-print flex items-center justify-between bg-gray-50 p-3 m-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">MOC Print Preview</h2>
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                    >
                        ← Back to Form
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                    </button>
                   
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div
                    id="moc-preview-root"
                    className="bg-white border border-black shadow-lg mx-auto max-w-4xl"
                    style={{ fontFamily: "Arial, sans-serif" }}
                >
                    {/* Header Section */}
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr>
                                <td
                                    rowSpan={3}
                                    className="border border-black text-center align-middle"
                                    style={{ width: "12%", padding: "4px" }}
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs font-bold">
                                            <img
                                                src="/assets/images/companylogo.png"
                                                className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition"
                                                alt="ems"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td
                                    colSpan={3}
                                    className="border border-black text-center font-bold"
                                    style={{ width: "76%", padding: "6px", fontSize: "13px" }}
                                >
                                    TYPICAL MOC REQUEST & APPROVAL FORM
                                </td>
                                <td
                                    className="border border-black font-bold"
                                    style={{ width: "16%", padding: "2px 4px", fontSize: "11px" }}
                                >
                                    <div>Doc. No.: {data.docNo || ""}</div>
                                    <div>Rev No.: {data.revNo || ""}</div>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan={3}
                                    className="border border-black text-center"
                                    style={{ padding: "2px", fontSize: "13px" }}
                                >
                                    <div className="font-bold">Management of Change</div>
                                </td>
                                <td
                                    className="border border-black font-bold"
                                    style={{ padding: "2px 4px", fontSize: "11px" }}
                                >
                                    <div>Issue No.: {data.issueNo || ""}</div>
                                    <div>Issue Date: {data.issueDate || ""}</div>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    colSpan={3}
                                    className="border border-black text-center"
                                    style={{ padding: "2px", fontSize: "11px" }}
                                >
                                    <div className="font-semibold">Page: {data.page || ""}</div>
                                </td>
                                <td
                                    className="border border-black text-center font-bold"
                                    style={{ padding: "2px", fontSize: "11px" }}
                                >
                                    Controlled
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Form Content */}
                    <table className="w-full border-collapse" style={{ fontSize: "12px" }}>
                        <tbody>
                            {/* Row 1 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" style={{ width: "25%" }}>
                                    1. Title of the MOC:
                                </td>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={3}>
                                    {data.title || ""}
                                </td>
                            </tr>

                            {/* Row 2 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold">2. MOC No:</td>
                                <td className="border border-black px-1 py-1" style={{ width: "25%" }}>
                                    {data.mocNo || ""}
                                </td>
                                <td className="border border-black px-1 py-1 font-bold" style={{ width: "25%" }}>
                                    Date:
                                </td>
                                <td className="border border-black px-1 py-1" style={{ width: "25%" }}>
                                    {data.date || ""}
                                </td>
                            </tr>

                            {/* Row 3 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold">3. Priority:</td>
                                <td className="border border-black px-1 py-1">
                                    {data.priority || ""}
                                </td>
                                <td className="border border-black px-1 py-1 font-bold">Modification type:</td>
                                <td className="border border-black px-1 py-1">
                                    {data.modificationType || ""}
                                </td>
                            </tr>

                            {/* Row 4 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold">Normal</td>
                                <td className="border border-black px-1 py-1">
                                    {data.priority === "Normal" ? "✓" : ""}
                                </td>
                                <td className="border border-black px-1 py-1 font-bold">Permanent</td>
                                <td className="border border-black px-1 py-1 font-bold">Shut down required:</td>
                            </tr>

                            {/* Row 5 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold">Urgent</td>
                                <td className="border border-black px-1 py-1">
                                    {data.priority === "Urgent" ? "✓" : ""}
                                </td>
                                <td className="border border-black px-1 py-1 font-bold">Temporary</td>
                                <td className="border border-black px-1 py-1">{data.shutdownRequired || ""}</td>
                            </tr>

                            {/* Row 6 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    4. Time limit in case of temporary modification:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.timeLimit || "N/A"}
                                </td>
                            </tr>

                            {/* Row 7 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    5. Present system and proposed change with detail of modification involves (Addition/ deletion/ modification):
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    <div className="whitespace-pre-wrap">
                                        <strong>Present:</strong> {data.presentSystem || ""}
                                        {"\n\n"}
                                        <strong>Proposed:</strong> {data.proposedChange || ""}
                                        {data.additionalAdditorsIfAny && `\n\n${data.additionalAdditorsIfAny}`}
                                    </div>
                                </td>
                            </tr>

                            {/* Row 8 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    6. Justification/reason for the modification:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.objectives || ""}
                                </td>
                            </tr>

                            {/* Row 9 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
                                    7. Whether upstream or downstream units are
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.upstreamDownstreamImpact === "Yes" ? "Yes ✓" : "Yes"}
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.upstreamDownstreamImpact === "No" ? "No ✓" : "No"}
                                </td>
                            </tr>

                            {/* Row 10 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    also impacted during implementation of
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    Details for SI No 7 if any:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.detailsIfAny || ""}
                                </td>
                            </tr>

                            {/* Row 11 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    8. Objective/Benefit of the proposal:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.objectives || ""}
                                </td>
                            </tr>

                            {/* Row 12 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    9. Is any statutory approval is required for the proposed change
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    If yes, please give details:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.statutoryApprovalRequired === "Yes" ? data.statutoryDetails : "N/A"}
                                </td>
                            </tr>

                            {/* Row 13 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    10 A. Impact of modification:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.impactOfModification || ""}
                                </td>
                            </tr>

                            {/* Row 14 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    10 B. Consequences of non-implementation:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.consequencesOfNonImplementation || ""}
                                </td>
                            </tr>

                            {/* Row 15 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    11. Impact of the proposed change on :
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.safetyOfProposedChange || ""}
                                </td>
                            </tr>

                            {/* Row 16 - Checklist */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
                                    a. Health, Safety & Environment
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.healthSafety === "Yes" ? "Yes ✓" : "Yes"}
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.healthSafety === "No" ? "No ✓" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
                                    b. Efficiency and operability
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.efficiency === "Yes" ? "Yes ✓" : "Yes"}
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.efficiency === "No" ? "No ✓" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
                                    c. Quality, Energy conservation and profit margin
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.qualityEnergy === "Yes" ? "Yes ✓" : "Yes"}
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.qualityEnergy === "No" ? "No ✓" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
                                    d. Reliability (Improvement of the plant, machineries and equipment)
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.reliabilityImprovement === "Yes" ? "Yes ✓" : "Yes"}
                                </td>
                                <td className="border border-black px-1 py-1 text-center font-bold">
                                    {data.reliabilityImprovement === "No" ? "No ✓" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
                                    e. Any other aspect
                                </td>
                                <td className="border border-black px-1 py-1 text-center" colSpan={2}>
                                    {data.anyOtherAspect || ""}
                                </td>
                            </tr>

                            {/* Row 17 */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    12. Whether HIRA has been done, if yes, attached the report:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.hiraAttached || ""}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={4}>
                                    13. Whether objectives of MOC have been met:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" colSpan={4}>
                                    {data.objectivesOfMocHaveBeenMet || ""}
                                </td>
                            </tr>

                            {/* Comments Section */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold">Comments:</td>
                                <td className="border border-black px-1 py-1 font-bold">Comments:</td>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>Comments:</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" style={{ minHeight: "60px" }}>
                                    <div className="whitespace-pre-wrap">{data.comments1 || ""}</div>
                                </td>
                                <td className="border border-black px-1 py-2">
                                    <div className="whitespace-pre-wrap">{data.comments2 || ""}</div>
                                </td>
                                <td className="border border-black px-1 py-2" colSpan={2}>
                                    <div className="whitespace-pre-wrap">{data.comments3 || ""}</div>
                                </td>
                            </tr>

                            {/* Signature Section */}
                            <tr>
                                <td className="border border-black px-1 py-1 font-bold">Prepared By</td>
                                <td className="border border-black px-1 py-1 font-bold">Reviewed By</td>
                                <td className="border border-black px-1 py-1 font-bold" colSpan={2}>Approved By</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1">Name:</td>
                                <td className="border border-black px-1 py-1">Name:</td>
                                <td className="border border-black px-1 py-1" colSpan={2}>Name:</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" style={{ minHeight: "30px" }}>
                                    {data.preparedByName || ""}
                                </td>
                                <td className="border border-black px-1 py-2">
                                    {data.reviewedByName || ""}
                                </td>
                                <td className="border border-black px-1 py-2" colSpan={2}>
                                    {data.approvedByName || ""}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-1">Designation:</td>
                                <td className="border border-black px-1 py-1">Designation:</td>
                                <td className="border border-black px-1 py-1" colSpan={2}>Designation:</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-1 py-2" style={{ minHeight: "30px" }}>
                                    {data.preparedByDesignation || ""}
                                </td>
                                <td className="border border-black px-1 py-2">
                                    {data.reviewedByDesignation || ""}
                                </td>
                                <td className="border border-black px-1 py-2" colSpan={2}>
                                    {data.approvedByDesignation || ""}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MocPreview;