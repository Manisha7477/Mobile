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


const MocCreateFormPreview: React.FC<MocPreviewProps> = ({ data, onBack }) => {
    const handlePrint = async () => {
        const element = document.getElementById("moc-preview-root");
        if (!element) return;

        // Clone the preview element so we can print it in isolation while keeping
        // the app visible. We'll inject a print-only stylesheet that hides other
        // content and shows only the cloned preview.
        const clone = element.cloneNode(true) as HTMLElement;
        clone.setAttribute("id", "printable-moc");
        // Inline sizing to better match A4 printed dimensions
        clone.style.width = "190mm";
        clone.style.maxWidth = "190mm";
        clone.style.margin = "0 auto";
        clone.style.boxSizing = "border-box";
        clone.style.background = "#ffffff";
        clone.style.padding = "12mm";

        // Create print stylesheet element
        const styleEl = document.createElement("style");
        styleEl.setAttribute("id", "printable-moc-style");
        styleEl.innerHTML = `
            @page { size: A4; margin: 12mm; }
            @media print {
                body * { visibility: hidden !important; }
                #moc-preview-root { display: none !important; }
                #printable-moc, #printable-moc * { visibility: visible !important; }
                #printable-moc { position: absolute; left: 0; top: 0; width: 190mm; max-width: 190mm; }
                table { page-break-inside: auto; border-collapse: collapse; }
                tr { page-break-inside: avoid; page-break-after: auto; break-inside: avoid; }
                td, th { page-break-inside: avoid; break-inside: avoid; }
                * { -webkit-print-color-adjust: exact; color-adjust: exact; }
            }
            /* Non-print layout to keep preview readable in the DOM */
            #printable-moc table { width: 100%; border-collapse: collapse; }
            #printable-moc td, #printable-moc th { border: 1px solid #000; padding: 4px; }
        `;

        document.body.appendChild(clone);
        document.head.appendChild(styleEl);

        // Wait for images to load inside the clone before printing (logo etc.)
        const images = Array.from(clone.querySelectorAll("img")) as HTMLImageElement[];
        const loaded = await Promise.all(images.map(img => {
            return new Promise<void>((resolve) => {
                if (img.complete) return resolve();
                img.onload = () => resolve();
                img.onerror = () => resolve();
            });
        }));

        // Trigger print of the current window — print CSS will show only #printable-moc
        try {
            window.print();
        } finally {
            // Clean up after a short delay to ensure print dialog started
            setTimeout(() => {
                const el = document.getElementById("printable-moc");
                if (el) el.remove();
                const s = document.getElementById("printable-moc-style");
                if (s) s.remove();
            }, 700);
        }
    };


    // ✅ Download PDF with better styling and fit-to-A4
    const handleDownloadPDF = async () => {
        const element = document.getElementById("moc-preview-root");
        if (!element) return;

        // Apply temporary white background & padding for clean export
        element.style.background = "#ffffff";
        element.style.padding = "20px";

        // Convert HTML to Canvas (hi-res). We'll slice the canvas into page-sized images
        // to produce clean multi-page PDFs without duplications. The header (top
        // table) will appear only on the first page.
        const scale = Math.max(2, window.devicePixelRatio || 2);
        const canvas = await html2canvas(element, {
            scale,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            scrollY: -window.scrollY,
        });

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginMm = 12; // same as print CSS
        const contentWidthMm = pdfWidth - marginMm * 2;
        const contentHeightMm = pdfHeight - marginMm * 2;

        // px per mm using full canvas width mapped to full page width
    // px per mm should map canvas pixels to content width (not full page width)
    const pxPerMm = canvas.width / contentWidthMm;
    const pageHeightPx = Math.floor(contentHeightMm * pxPerMm);

        // Try to detect header height (first table) so we ensure header only on page 1
        const headerEl = element.querySelector("table");
        const headerRect = headerEl ? headerEl.getBoundingClientRect() : null;
        const headerPx = headerRect ? Math.round(headerRect.height * scale) : 0;

        // Create pages: first page starts at y=0 and includes header; subsequent
        // pages start at y = pageHeightPx, pageHeightPx*2, ... (no repeated header)
        let y = 0;
        let pageIndex = 0;
        while (y < canvas.height) {
            const fragmentHeight = Math.min(pageHeightPx, canvas.height - y);

            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = canvas.width;
            pageCanvas.height = fragmentHeight;
            const pageCtx = pageCanvas.getContext("2d");
            if (!pageCtx) break;

            pageCtx.drawImage(canvas, 0, y, canvas.width, fragmentHeight, 0, 0, canvas.width, fragmentHeight);
            const imgData = pageCanvas.toDataURL("image/png");

            const imgHeightMm = fragmentHeight / pxPerMm;

            if (pageIndex > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", marginMm, marginMm, contentWidthMm, imgHeightMm);

            y += fragmentHeight;
            pageIndex++;
        }

        pdf.save(`MOC_Form_${data?.mocNo || "Preview"}.pdf`);

        element.style.background = "";
        element.style.padding = "";
    };

    const printStyle = `
        @page {
            size: A4;
            margin: 12mm;
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
                width: 190mm; /* fit A4 width minus margins */
                max-width: 190mm;
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
            /* Prevent table rows/cells from splitting across pages when possible */
            table { page-break-inside: auto; border-collapse: collapse; }
            tr    { page-break-inside: avoid; page-break-after: auto; break-inside: avoid; }
            td, th { page-break-inside: avoid; break-inside: avoid; }
            /* Ensure borders render correctly on print */
            * { -webkit-print-color-adjust: exact; color-adjust: exact; }
        }
    `;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center p-6 overflow-auto">
            <div className="bg-white rounded shadow-lg w-full max-w-5xl">
                <style>{printStyle}</style>

                {/* Header Buttons */}
                <div className="no-print flex items-center justify-between bg-gray-50 p-3 border-b">
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
                        className="bg-white border border-black shadow-lg mx-auto max-w-4xl p-4"
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
                                {/* Signature Lines */}
                                <tr>
                                    <td className="border border-black px-1 py-2 text-center" style={{ minHeight: "40px" }}>
                                        <div style={{ borderBottom: '1px solid #000', width: '80%', margin: '0 auto', height: '24px' }} />
                                        <div className="text-xs">Signature</div>
                                    </td>
                                    <td className="border border-black px-1 py-2 text-center" style={{ minHeight: "40px" }}>
                                        <div style={{ borderBottom: '1px solid #000', width: '80%', margin: '0 auto', height: '24px' }} />
                                        <div className="text-xs">Signature</div>
                                    </td>
                                    <td className="border border-black px-1 py-2 text-center" colSpan={2} style={{ minHeight: "40px" }}>
                                        <div style={{ borderBottom: '1px solid #000', width: '80%', margin: '0 auto', height: '24px' }} />
                                        <div className="text-xs">Signature</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MocCreateFormPreview;
