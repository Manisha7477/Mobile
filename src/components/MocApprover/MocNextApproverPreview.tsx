"use client";

import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface HiraItem {
    id: number;
    activity: string;
    hazard: string;
    risk: string;
    consequence: string;
    riskLevel: string;
    controlMeasures: string;
}

interface HiraFormData {
    docNo?: string;
    revNo?: string;
    page?: string;
    mocNo?: string;
    stationName?: string;
    divisionDept?: string;
    projectRequisition?: string;
    jobDescription?: string;
    date?: string;
    title?: string;
    hiraItems: HiraItem[];
    particularPoints?: string;
    commentsInitiator?: string;
    commentsHiraReviewer?: string;
    commentsReviewer?: string;
    preparedByName?: string;
    preparedByDesignation?: string;
    reviewedByName?: string;
    reviewedByDesignation?: string;
    approvedByName?: string;
    approvedByDesignation?: string;
}

interface HiraPreviewProps {
    data: HiraFormData;
    onBack: () => void;
}

 


const MocNextApproverPriview: React.FC<HiraPreviewProps> = ({ data, onBack }) => {
    const handlePrint = () => {
        window.print();
    };

    const printStyle = `
        @page {
            size: A4 ;
            margin: 8mm;
        }
        
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            body * {
                visibility: hidden !important;
            }
            
            #hira-preview-root, #hira-preview-root * {
                visibility: visible !important;
            }
            
            #hira-preview-root {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                transform: none !important;
                page-break-after: auto !important;
                page-break-before: auto !important;
                page-break-inside: avoid !important;
            }
            
            #hira-preview-root table {
                page-break-inside: auto !important;
            }
            
            #hira-preview-root tr {
                page-break-inside: avoid !important;
                page-break-after: auto !important;
            }
            
            .no-print {
                display: none !important;
            }
            
            /* Ensure proper scaling */
            html, body {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }
        }
    `;

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

    return (
        <div className="min-h-screen bg-gray-50 w-full">
            <style>{printStyle}</style>

            {/* Header Bar */}
            <div className="no-print w-full bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">HIRA Form</h1>
                        <p className="text-sm text-gray-600 mt-1">Print Preview</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="px-5 py-2.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Form
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            {/* Preview Content */}
            <div className="max-w-[1400px] mx-auto px-4 py-8">
                <div
                    id="hira-preview-root"
                    className="bg-white border border-black shadow-2xl mx-auto"
                    style={{
                        fontFamily: "Arial, sans-serif",
                        width: "100%",
                        maxWidth: "1400px"
                    }}
                >
                    {/* Header Section */}
                    <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                        <tbody>
                            <tr>
                                <td
                                    rowSpan={2}
                                    className="border border-black text-center align-middle bg-white"
                                    style={{ width: "12%", padding: "8px", verticalAlign: "middle" }}
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="font-bold text-xs leading-tight" style={{ fontSize: "10px" }}>
                                            <img
                                                src="/assets/images/companylogo.png"
                                                className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition"
                                                alt="ems"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td
                                    className="border border-black text-center font-bold align-middle bg-white"
                                    style={{ width: "63%", padding: "8px", fontSize: "13px", verticalAlign: "middle" }}
                                >
                                    DEVANGONTHI RECEIVING STATION
                                </td>
                                <td
                                    className="border border-black bg-white"
                                    style={{ width: "25%", padding: "6px 8px", fontSize: "10px", verticalAlign: "top" }}
                                >
                                    <div><strong>Doc No.:</strong> {data.docNo || "DKN/HRA/FILTER SEPARATOR"}</div>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className="border border-black text-center font-bold bg-white"
                                    style={{ padding: "6px", fontSize: "11px", verticalAlign: "middle" }}
                                >
                                    DIVISION/ DEPT NAME
                                </td>
                                <td
                                    className="border border-black bg-white"
                                    style={{ padding: "4px 8px", fontSize: "10px", verticalAlign: "top" }}
                                >
                                    <div><strong>Rev.:</strong> {data.revNo || "01"}</div>
                                    <div><strong>Page:</strong> {data.page || "1 & 2"}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Basic Info Section */}
                    <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                        <tbody>
                            <tr>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ width: "25%", fontSize: "11px" }}>
                                    PROJECT /REQUISITION NO
                                </td>
                                <td className="border border-black px-3 py-2 bg-white" style={{ fontSize: "11px" }}>
                                    {data.projectRequisition || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "11px" }}>
                                    JOB DESCRIPTION
                                </td>
                                <td className="border border-black px-3 py-2 bg-white" style={{ fontSize: "11px" }}>
                                    {data.jobDescription || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* HIRA Table */}
                    <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                        <thead>
                            <tr className="bg-white">
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "5%", fontSize: "10px" }}>
                                    SI No.
                                </th>
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "13%", fontSize: "10px" }}>
                                    Activity
                                </th>
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "13%", fontSize: "10px" }}>
                                    Hazard
                                </th>
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "10%", fontSize: "10px" }}>
                                    Risk
                                </th>
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "13%", fontSize: "10px" }}>
                                    Consequence
                                </th>
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "10%", fontSize: "10px" }}>
                                    Risk Level
                                </th>
                                <th className="border border-black px-2 py-2 font-bold text-center" style={{ width: "36%", fontSize: "10px" }}>
                                    Control Measures / Mitigation Plan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.hiraItems && data.hiraItems.length > 0 ? (
                                data.hiraItems.map((item, index) => (
                                    <tr key={item.id} className="bg-white">
                                        <td className="border border-black px-2 py-3 text-center" style={{ fontSize: "10px" }}>
                                            {index + 1}
                                        </td>
                                        <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>
                                            {item.activity || "N/A"}
                                        </td>
                                        <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>
                                            {item.hazard || "N/A"}
                                        </td>
                                        <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>
                                            {item.risk || "N/A"}
                                        </td>
                                        <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>
                                            {item.consequence || "N/A"}
                                        </td>
                                        <td className="border border-black px-2 py-3 text-center" style={{ fontSize: "10px" }}>
                                            {item.riskLevel || "N/A"}
                                        </td>
                                        <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>
                                            {item.controlMeasures || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td className="border border-black px-2 py-3 text-center" style={{ fontSize: "10px" }}>1</td>
                                    <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>N/A</td>
                                    <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>N/A</td>
                                    <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>N/A</td>
                                    <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>N/A</td>
                                    <td className="border border-black px-2 py-3 text-center" style={{ fontSize: "10px" }}>N/A</td>
                                    <td className="border border-black px-2 py-3" style={{ fontSize: "10px" }}>N/A</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Particular Points Section */}
                    <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                        <tbody>
                            <tr>
                                <td className="border border-black px-3 py-2 font-bold bg-white" colSpan={4} style={{ fontSize: "11px" }}>
                                    Any Particular Points:
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-3 py-4 bg-white" colSpan={4} style={{ minHeight: "60px", verticalAlign: "top", fontSize: "11px" }}>
                                    {data.particularPoints || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Signature Section */}
                    <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                        <tbody>
                            <tr>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ width: "33.33%", fontSize: "11px" }}>
                                    Prepared By
                                </td>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ width: "33.33%", fontSize: "11px" }}>
                                    Reviewed By
                                </td>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ width: "33.33%", fontSize: "11px" }}>
                                    Approved By
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "10px" }}>Name:</td>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "10px" }}>Name:</td>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "10px" }}>Name:</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-3 py-4 bg-white" style={{ minHeight: "40px", fontSize: "11px" }}>
                                    {data.preparedByName || ""}
                                </td>
                                <td className="border border-black px-3 py-4 bg-white" style={{ fontSize: "11px" }}>
                                    {data.reviewedByName || ""}
                                </td>
                                <td className="border border-black px-3 py-4 bg-white" style={{ fontSize: "11px" }}>
                                    {data.approvedByName || ""}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "10px" }}>Designation:</td>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "10px" }}>Designation:</td>
                                <td className="border border-black px-3 py-2 font-bold bg-white" style={{ fontSize: "10px" }}>Designation:</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-3 py-4 bg-white" style={{ minHeight: "40px", fontSize: "11px" }}>
                                    {data.preparedByDesignation || ""}
                                </td>
                                <td className="border border-black px-3 py-4 bg-white" style={{ fontSize: "11px" }}>
                                    {data.reviewedByDesignation || ""}
                                </td>
                                <td className="border border-black px-3 py-4 bg-white" style={{ fontSize: "11px" }}>
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

export default MocNextApproverPriview;