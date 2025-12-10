// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
// import MocPreview from "@/components/MocReview/MocPreview"
// import MocPreviewPage from "@/components/MocReview/MocPreview";



// type SectionKey =
//     | "basicInfo"
//     | "classification"
//     | "systemDetails"
//     | "justification"
//     | "impactOther"
//     | "statutory"
//     | "impactAnalysis"
//     | "impactSpecificAreas"
//     | "objectivesAchievement"
//     | "uploadDocument"
//     | "comments"

// type ExpandedSections = {
//     [K in SectionKey]: boolean;
// };

// interface MoCRequestFormProps {
//     currentStep: number;
//     handleCancel?: () => void;
//     handleNext: () => void;
//     handleBack: () => void;
//     handleSubmit: () => void;
// }

// const MoCRequestForm: React.FC<MoCRequestFormProps> = ({
//     currentStep,
//     handleCancel,
//     handleNext,
//     handleBack,
//     handleSubmit,
// }) => {
//     const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
//         basicInfo: false,
//         classification: false,
//         systemDetails: false,
//         justification: false,
//         impactOther: false,
//         statutory: false,
//         impactAnalysis: false,
//         impactSpecificAreas: false,
//         objectivesAchievement: false,
//         uploadDocument: false,
//         comments: false,
//     });

//     const toggleSection = (section: SectionKey) => {
//         setExpandedSections((prev) => ({
//             ...prev,
//             [section]: !prev[section],
//         }));
//     };

//     const mocSections: Array<{ id: SectionKey; title: string }> = [
//         { id: "basicInfo", title: "1. Basic Information" },
//         { id: "classification", title: "2. Classification" },
//         { id: "systemDetails", title: "3. System Details" },
//         { id: "justification", title: "4. Justification & Benefits" },
//         { id: "impactOther", title: "5. Impact on Other Units" },
//         { id: "statutory", title: "6. Statutory Approvals" },
//         { id: "impactAnalysis", title: "7. Impact Analysis" },
//         { id: "impactSpecificAreas", title: "8. Impact on Specific Areas" },
//         { id: "objectivesAchievement", title: "9. Objective Achievement" },
//         { id: "uploadDocument", title: "10. Upload Document" },
//         { id: "comments", title: "11. Comments(Initiator)" },
//     ];

//     const isReadOnly = true;

//         // -----------------------------
//     // NEW: Print Preview handler
//     // -----------------------------
//     // This collects current values from the form inputs present on the page,
//     // serializes them and stores in localStorage under "mocFormData".
//     // Then open the preview route in a new tab with ?print=true so preview
//     // auto-triggers printing of just the preview element.
//     const handlePrintPreview = () => {
//         // Collect current form values from DOM (so we don't need to change your structure).
//         // We look up by input/select/textarea names or other known selectors.
//         // If you already manage state for fields, replace this section to build from state.
//         const collect = () => {
//             const out: Record<string, any> = {};

//             // helper to read single inputs by id/name if present
//             const getVal = (selector: string) => {
//                 const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
//                 return el ? el.value : "";
//             };

//             // Common fields present in your form — adjust selectors if you used different names/ids.
//             out.title = getVal('input[name="title"]') || getVal('#title') || "";
//             out.mocNo = getVal('input[name="mocNo"]') || getVal('#mocNo') || (document.querySelector('input[defaultValue]')?.getAttribute('defaultValue') ?? "");
//             out.revNo = getVal('input[name="revNo"]') || getVal('#revNo') || "";
//             out.issueNo = getVal('input[name="issueNo"]') || getVal('#issueNo') || "";
//             out.page = getVal('input[name="page"]') || getVal('#page') || "";
//             out.stationName = getVal('input[name="stationName"]') || getVal('#stationName') || "";
//             out.date = getVal('input[type="date"]#mocDate') || getVal('input[name="date"]') || "";
//             out.priority = (document.querySelector('select[name="priority"]') as HTMLSelectElement)?.value || "";
//             out.modificationType = (document.querySelector('input[name="modType"]:checked') as HTMLInputElement)?.value || "";
//             out.shutdownRequired = (document.querySelector('input[name="shutdown"]:checked') as HTMLInputElement)?.value || "";
//             out.timeLimit = getVal('input[name="timeLimit"]') || "";
//             out.presentSystem = getVal('textarea[name="presentSystem"]') || getVal('#presentSystem') || "";
//             out.proposedChange = getVal('textarea[name="proposedChange"]') || getVal('#proposedChange') || "";
//             out.justification = getVal('textarea[name="justification"]') || getVal('#justification') || "";
//             out.objectives = getVal('textarea[name="objectives"]') || getVal('#objectives') || "";
//             out.upstreamImpact = (document.querySelector('input[name="impactOtherUnits"]:checked') as HTMLInputElement)?.value || "";
//             out.impactDetails = getVal('input[name="impactDetails"]') || getVal('#impactDetails') || "";
//             out.statutoryApproval = (document.querySelector('input[name="statutoryApproval"]:checked') as HTMLInputElement)?.value || "";
//             out.statutoryDetails = getVal('textarea[name="statutoryDetails"]') || getVal('#statutoryDetails') || "";
//             out.consequencesNonImplementation = getVal('textarea[name="consequencesNonImplementation"]') || "";
//             out.otherAspects = getVal('input[name="otherAspects"]') || "";
//             out.objectivesMet = (document.querySelector('input[name="objectiveAchievement"]:checked') as HTMLInputElement)?.value || "";
//             out.hiraAttached = ""; // if you have a named control, read it similarly
//             out.comments = getVal('textarea[name="comments"]') || "";
//             out.preparedBy = getVal('input[name="preparedBy"]') || "";
//             out.preparedDesignation = getVal('input[name="preparedDesignation"]') || "";
//             out.reviewedBy = getVal('input[name="reviewedBy"]') || "";
//             out.reviewedDesignation = getVal('input[name="reviewedDesignation"]') || "";
//             out.approvedBy = getVal('input[name="approvedBy"]') || "";
//             out.approvedDesignation = getVal('input[name="approvedDesignation"]') || "";

//             // For the impactAnalysisYesNo block, try reading by known text labels
//             const mapping: Record<string, string> = {
//                 "HSE": "Health, Safety & Environment",
//                 "Efficiency": "Efficiency and operability",
//                 "Quality": "Quality, Energy consumption and profit margin",
//                 "Reliability": "Reliability (Improvement of plant, machineries and equipment)"
//             };
//             out.impactAnalysisYesNo = {};
//             Object.keys(mapping).forEach((k) => {
//                 // try find radio group by label text - fallback empty
//                 const yesEl = Array.from(document.querySelectorAll('input')).find(inp =>
//                     inp.getAttribute('type') === 'radio' &&
//                     (inp as HTMLInputElement).name &&
//                     (inp as HTMLInputElement).name.includes(mapping[k].slice(0,10))
//                 ) as HTMLInputElement | undefined;
//                 out.impactAnalysisYesNo[k] = yesEl ? (yesEl.checked ? (yesEl.value || "Yes") : "") : "";
//             });

//             return out;
//         };

//         const data = collect();
//         // Save to localStorage
//         try {
//             localStorage.setItem("mocFormData", JSON.stringify(data));
//         } catch (e) {
//             console.error("Failed to save mocFormData", e);
//         }

//         // Open preview in a new tab that will auto-print only the preview area:
//         // Use ?print=true so the preview page auto-triggers print.
//         const previewUrl = "/line/PreviewMoc";
//         window.open(previewUrl, "_blank", "noopener,noreferrer");
//     };
//     // -----------------------------
//     // END: Print Preview handler
//     // -----------------------------





//     return (
//         <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[75vh] max-h-[67vh]">
//             {/* Scrollable content */}
//             <div className="p-2 overflow-y-auto flex-1">
//                 {mocSections.map((section) => (
//                     <div key={section.id} className="border rounded-lg mb-2">
//                         {/* Accordion Header */}
//                         <button
//                             onClick={() => toggleSection(section.id)}
//                             className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
//                         >
//                             <span className="font-semibold text-gray-800">
//                                 {section.title}
//                             </span>
//                             {expandedSections[section.id] ? (
//                                 <ChevronUp className="w-5 h-5 text-gray-600" />
//                             ) : (
//                                 <ChevronDown className="w-5 h-5 text-gray-600" />
//                             )}
//                         </button>
//                         {/* Scrollable content inside each section */}
//                         {expandedSections[section.id] && (
//                             <div className="p-3 bg-white border-t max-h-60 overflow-y-auto">
//                                 <div className="space-y-4">
//                                     {section.id === "basicInfo" && (
//                                         <>
//                                             <div className="grid grid-cols-2 gap-10 mb-5">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         MoC Request No. <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         defaultValue="MoC/MLR/2025-26/001"
//                                                         className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Station Name <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         defaultValue="Devangonthi Receiving Station"
//                                                         className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-10">
//                                                 <div>
//                                                     <div>
//                                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                             Date <span className="text-red-500">*</span>
//                                                         </label>
//                                                         <div className="relative flex items-center">
//                                                             {/* Custom Calendar Icon */}
//                                                             <Calendar
//                                                                 className="absolute left-3 text-gray-500 w-5 h-5 cursor-pointer"


//                                                             />
//                                                             {/* Date Input with hidden native icon */}
//                                                             <input
//                                                                 id="mocDate"
//                                                                 type="date"
//                                                                 className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-md 
//                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
//                  [&::-webkit-calendar-picker-indicator]:opacity-0 
//                  [&::-webkit-calendar-picker-indicator]:absolute"
//                                                                 placeholder="Select date"
//                                                                 readOnly
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Title of the MoC <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         placeholder="Enter the title of the MoC"
//                                                         readOnly
//                                                     />
//                                                 </div>

//                                             </div>
//                                         </>
//                                     )}
//                                     {section.id === "classification" && (
//                                         <div className="grid grid-cols-2 gap-10 mb-5">
//                                             {/* Left Column */}
//                                             <div className="space-y-5">
//                                                 {/* Priority */}
//                                                 <div className="relative">
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1" >
//                                                         Priority <span className="text-red-500">*</span>
//                                                     </label>

//                                                     {/* Wrapper with custom chevron */}
//                                                     <div className="relative">
//                                                         <select
//                                                             className="w-full appearance-none px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                             disabled={isReadOnly}
//                                                         >
//                                                             <option value="" >Choose</option>
//                                                             <option value="High">High</option>
//                                                             <option value="Medium">Medium</option>
//                                                             <option value="Low">Low</option>
//                                                         </select>

//                                                         {/* Custom dropdown icon */}
//                                                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
//                                                     </div>
//                                                 </div>
//                                                 {/* Modification Type */}
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Modification Type <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6 mt-1">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700" >
//                                                             <input type="radio" name="modType" value="Permanent" className="accent-blue-600" disabled={isReadOnly} />
//                                                             Permanent
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input type="radio" name="modType" value="Temporary" className="accent-blue-600" disabled={isReadOnly} />
//                                                             Temporary
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Right Column */}
//                                             <div className="space-y-5">
//                                                 {/* Time Limit */}
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Time Limit in case of temporary modification
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         placeholder="Enter time limit"
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly
//                                                     />
//                                                 </div>

//                                                 {/* Shutdown Required */}
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Shutdown Required <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6 mt-1">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input type="radio" name="shutdown" value="Yes" className="accent-blue-600" disabled={isReadOnly} />
//                                                             Yes
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input type="radio" name="shutdown" value="No" className="accent-blue-600" disabled={isReadOnly} />
//                                                             No
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "systemDetails" && (
//                                         <div className="space-y-1">
//                                             {/* Present System */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Present System <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="Describe the current system"
//                                                     rows={2}
//                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>

//                                             {/* Proposed Changes */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Proposed Changes <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="Describe the proposed changes"
//                                                     rows={2}
//                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "justification" && (
//                                         <div className="space-y-5">
//                                             {/* Justification / Reason for Modification */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Justification / Reason for Modification <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="Explain why this modification is necessary"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>
//                                             {/* Objective / Benefits of the Proposal */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Objective / Benefits of the Proposal <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="Describe the expected benefits and objectives"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactOther" && (
//                                         <div className="space-y-5">
//                                             {/* Impact on Other Units */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Whether upstream or downstream units are also impacted <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6 mt-1">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input type="radio" name="impactOtherUnits" value="Yes" className="accent-blue-600" disabled={isReadOnly} />
//                                                         Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input type="radio" name="impactOtherUnits" value="No" className="accent-blue-600" disabled={isReadOnly} />
//                                                         No
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input type="radio" name="impactOtherUnits" value="NotApplicable" className="accent-blue-600" disabled={isReadOnly} />
//                                                         Not Applicable
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "statutory" && (
//                                         <div className="space-y-5">
//                                             {/* Statutory Approval Required */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Is any statutory approval required <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6 mt-1">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input type="radio" name="statutoryApproval" value="Yes" className="accent-blue-600" disabled={isReadOnly} />
//                                                         Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input type="radio" name="statutoryApproval" value="No" className="accent-blue-600" disabled={isReadOnly} />
//                                                         No
//                                                     </label>
//                                                 </div>
//                                             </div>

//                                             {/* Additional Details */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     If yes, please give details
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="Explain why statutory approval is required"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactAnalysis" && (
//                                         <div className="space-y-5">
//                                             {/* Impact of Modification */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Impact of Modification <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="Describe the potential impacts of this modification"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>

//                                             {/* Consequences of Non-Implementation */}
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Consequences of Non-Implementation
//                                                 </label>
//                                                 <textarea
//                                                     placeholder="What would happen if this modification is not implemented?"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactSpecificAreas" && (
//                                         <div className="space-y-4">
//                                             {[
//                                                 "Health, Safety & Environment",
//                                                 "Efficiency and operability",
//                                                 "Quality, Energy consumption and profit margin",
//                                                 "Reliability (Improvement of plant, machineries and equipment)",
//                                             ].map((label, idx) => (
//                                                 <div key={idx}>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         {label} <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input type="radio" name={label} value="Yes" className="accent-blue-600" disabled={isReadOnly} /> Yes
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input type="radio" name={label} value="No" className="accent-blue-600" disabled={isReadOnly} /> No
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             ))}

//                                             {/* Any Other Aspects */}
//                                             <div className="flex items-center gap-2 mt-2">
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Any Other Aspects:
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Please Specify"
//                                                     className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
//                                                     readOnly
//                                                 />
//                                                 <button className="bg-blue-600 text-white rounded-md px-3 py-1 hover:bg-blue-700">
//                                                     +
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "objectivesAchievement" && (
//                                         <div className="space-y-2">
//                                             <p className="text-sm text-gray-700">Whether objectives of MOC have been met</p>
//                                             {["Yes", "No", "Pending implementation"].map((option) => (
//                                                 <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
//                                                     <input
//                                                         type="radio"
//                                                         name="objectiveAchievement"
//                                                         value={option}
//                                                         className="accent-blue-600"
//                                                         disabled={isReadOnly}
//                                                     />
//                                                     {option}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//                                     {section.id === "uploadDocument" && (
//                                         <div className="space-y-3">
//                                             <p className="text-sm text-gray-700">Attach supporting documents</p>
//                                             {[
//                                                 "Process Flow Diagram - Rev 2.pdf",
//                                                 "HIRA Assessment Form.xlsx",
//                                                 "Operating Procedure SOP-101.docx",
//                                             ].map((file) => (
//                                                 <div
//                                                     key={file}
//                                                     className="flex justify-between items-center border border-gray-200 rounded-md p-2 bg-gray-50"
//                                                 >
//                                                     <div className="flex items-center gap-2 text-gray-700">
//                                                         <span className="text-blue-600">📄</span>
//                                                         <span className="text-sm">{file}</span>
//                                                     </div>
//                                                     <button className="text-gray-500 hover:text-blue-600 text-sm">⬇</button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                     {section.id === "comments" && (
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Comments
//                                             </label>
//                                             <textarea
//                                                 placeholder="Enter comments (if any)"
//                                                 defaultValue="Nill"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
//                                                 readOnly
//                                             />
//                                         </div>
//                                     )}

//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//             {/* Sticky Footer */}
//             <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-2 border-t border-gray-200 shadow-inner">
//                 <button
//                     onClick={handleCancel}
//                     className="px-5  bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     onClick={handlePrintPreview}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                     </svg>
//                     Print Preview
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     className="px-5 p-1.5 mr-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
//                 >
//                     Next
//                 </button>

//             </div>

//         </div>
//     );
// };

// export default MoCRequestForm;


//old code 
// "use client";

// import React, { useState } from "react";
// import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
// import MocPreview from "./MocPreview"; // Import the preview component
// // Add these imports at the top of your MoCRequestForm.tsx file
// import { useEffect } from 'react';
// import api from "@/api/axiosInstance";
// import { useSearchParams } from "react-router-dom";

// type SectionKey =
//     | "basicInfo"
//     | "classification"
//     | "systemDetails"
//     | "justification"
//     | "impactOther"
//     | "statutory"
//     | "impactAnalysis"
//     | "impactSpecificAreas"
//     | "objectivesAchievement"
//     | "uploadDocument"
//     | "comments"

// type ExpandedSections = {
//     [K in SectionKey]: boolean;
// };

// // Add this interface for the API response
// interface MocApiResponse {
//     moc_request_no?: string;
//     station_name?: string;
//     title?: string;
//     date?: string;
//     priority?: string;
//     modification_type?: string;
//     time_limit?: string;
//     shutdown_required?: string;
//     present_system?: string;
//     proposed_change?: string;
//     justification?: string;
//     objectives?: string;
//     other_units_impacted?: string;
//     statutory_approval_required?: string;
//     statutory_approval_details?: string;
//     impact_of_modification?: string;
//     consequences_non_implementation?: string;
//     hse?: boolean;
//     efficiency?: boolean;
//     quality?: boolean;
//     reliability?: boolean;
//     other_aspects?: string;
//     objectives_achieved?: string;
//     attachments?: string;
//     comments?: string;
//     status?: string;
//     created_by?: string;
//     created_at?: string;
// }

// export type MocFormData = {
//     docNo?: string;
//     revNo?: string;
//     issueNo?: string;
//     issueDate?: string;
//     page?: string;
//     title?: string;
//     mocNo?: string;
//     stationName?: string;
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

// interface MoCRequestFormProps {
//     currentStep: number;
//     handleCancel?: () => void;
//     handleNext: () => void;
//     handleBack: () => void;
//     handleSubmit: () => void;
//     mocRequestNo?: string;
// }

// const MoCRequestForm: React.FC<MoCRequestFormProps> = ({
//     currentStep,
//     handleCancel,
//     handleNext,
//     handleBack,
//     handleSubmit,
//     mocRequestNo,
// }) => {
//     const [formData, setFormData] = useState<MocFormData>({});
//     const [showPreview, setShowPreview] = useState(false);
//     const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
//         basicInfo: false,
//         classification: false,
//         systemDetails: false,
//         justification: false,
//         impactOther: false,
//         statutory: false,
//         impactAnalysis: false,
//         impactSpecificAreas: false,
//         objectivesAchievement: false,
//         uploadDocument: false,
//         comments: false,
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

   

//    useEffect(() => {
//     // Get moc_request_no from URL if not passed via props
//     const params = new URLSearchParams(window.location.search);
//     const mocRequestNoFromUrl = params.get("moc_request_no");
//     const finalMocRequestNo = mocRequestNo || mocRequestNoFromUrl;

//     console.log("✅ useEffect triggered with MOC Request No:", finalMocRequestNo);

//     if (finalMocRequestNo) {
//         fetchMocData(finalMocRequestNo);
//     } else {
//         console.warn("⚠️ mocRequestNo missing — cannot fetch data.");
//     }
// }, [mocRequestNo]);

// // ✅ API fetch function
// const fetchMocData = async (requestNo: string) => {
//     try {
//         setLoading(true);
//         setError(null);

//         // Add Bearer token from localStorage or context
//         const token = localStorage.getItem("token");

//         const res = await api.get(`/api/MOC/GetMocRequest`, {
//             params: { moc_request_no: requestNo },
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         console.log("✅ API Response:", res.data);

//         // Your API returns a single object, not res.data.data
//         const data: MocApiResponse = res.data;

//         if (!data) {
//             console.error("⚠️ Empty API response for request:", requestNo);
//             setError("No data found for this request number");
//             return;
//         }

//         // ✅ Map the API data into your formData
//         setFormData({
//             mocNo: data.moc_request_no || "",
//             stationName: data.station_name || "",
//             title: data.title || "",
//             date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
//             priority: data.priority || "",
//             modificationType: data.modification_type || "",
//             timeLimit: data.time_limit || "",
//             shutdownRequired: data.shutdown_required || "",
//             presentSystem: data.present_system || "",
//             proposedChange: data.proposed_change || "",
//             objectives: data.objectives || "",
//             upstreamDownstreamImpact: data.other_units_impacted ? "Yes" : "No",
//             detailsIfAny: data.other_units_impacted || "",
//             statutoryApprovalRequired: data.statutory_approval_required || "",
//             statutoryDetails: data.statutory_approval_details || "",
//             impactOfModification: data.impact_of_modification || "",
//             consequencesOfNonImplementation: data.consequences_non_implementation || "",
//             healthSafety: data.hse ? "Yes" : "No",
//             efficiency: data.efficiency ? "Yes" : "No",
//             qualityEnergy: data.quality ? "Yes" : "No",
//             reliabilityImprovement: data.reliability ? "Yes" : "No",
//             anyOtherAspect: data.other_aspects || "",
//             objectivesOfMocHaveBeenMet: data.objectives_achieved || "",
//             comments1: data.comments || "",
//         });

//         console.log("✅ MOC Data set successfully.");
//     } catch (error: any) {
//         console.error("🚨 Failed to fetch MOC data:", error);
//         setError(error?.response?.data?.message || "Failed to load MOC data");
//     } finally {
//         setLoading(false);
//     }
// };




//     const toggleSection = (section: SectionKey) => {
//         setExpandedSections((prev) => ({
//             ...prev,
//             [section]: !prev[section],
//         }));
//     };

//     const mocSections: Array<{ id: SectionKey; title: string }> = [
//         { id: "basicInfo", title: "1. Basic Information" },
//         { id: "classification", title: "2. Classification" },
//         { id: "systemDetails", title: "3. System Details" },
//         { id: "justification", title: "4. Justification & Benefits" },
//         { id: "impactOther", title: "5. Impact on Other Units" },
//         { id: "statutory", title: "6. Statutory Approvals" },
//         { id: "impactAnalysis", title: "7. Impact Analysis" },
//         { id: "impactSpecificAreas", title: "8. Impact on Specific Areas" },
//         { id: "objectivesAchievement", title: "9. Objective Achievement" },
//         { id: "uploadDocument", title: "10. Upload Document" },
//         { id: "comments", title: "11. Comments(Initiator)" },
//     ];

//     const isReadOnly = true;

//     const handleInputChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//     ) => {
//         const { name, value, type } = e.target;

//         if (type === 'radio') {
//             const inputElement = e.target as HTMLInputElement;
//             if (inputElement.checked) {
//                 setFormData(prev => ({
//                     ...prev,
//                     [name]: value
//                 }));
//             }
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const collectFormData = (): MocFormData => {
//         const getVal = (selector: string) => {
//             const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
//             return el ? el.value : "";
//         };

//         return {
//             ...formData,
//             title: getVal('input[name="title"]') || formData.title,
//             date: getVal('input[name="date"]') || formData.date,
//             priority: getVal('select[name="priority"]') || formData.priority,
//             modificationType: (document.querySelector('input[name="modType"]:checked') as HTMLInputElement)?.value || formData.modificationType,
//             shutdownRequired: (document.querySelector('input[name="shutdown"]:checked') as HTMLInputElement)?.value || formData.shutdownRequired,
//             timeLimit: getVal('input[name="timeLimit"]') || formData.timeLimit,
//             presentSystem: getVal('textarea[name="presentSystem"]') || formData.presentSystem,
//             proposedChange: getVal('textarea[name="proposedChange"]') || formData.proposedChange,
//             objectives: getVal('textarea[name="objectives"]') || formData.objectives,
//             upstreamDownstreamImpact: (document.querySelector('input[name="impactOtherUnits"]:checked') as HTMLInputElement)?.value || formData.upstreamDownstreamImpact,
//             detailsIfAny: getVal('input[name="impactDetails"]') || formData.detailsIfAny,
//             statutoryApprovalRequired: (document.querySelector('input[name="statutoryApproval"]:checked') as HTMLInputElement)?.value || formData.statutoryApprovalRequired,
//             statutoryDetails: getVal('textarea[name="statutoryDetails"]') || formData.statutoryDetails,
//             impactOfModification: getVal('textarea[name="impactOfModification"]') || formData.impactOfModification,
//             consequencesOfNonImplementation: getVal('textarea[name="consequencesNonImplementation"]') || formData.consequencesOfNonImplementation,
//             healthSafety: (document.querySelector('input[name="healthSafety"]:checked') as HTMLInputElement)?.value || formData.healthSafety,
//             efficiency: (document.querySelector('input[name="efficiency"]:checked') as HTMLInputElement)?.value || formData.efficiency,
//             qualityEnergy: (document.querySelector('input[name="qualityEnergy"]:checked') as HTMLInputElement)?.value || formData.qualityEnergy,
//             reliabilityImprovement: (document.querySelector('input[name="reliability"]:checked') as HTMLInputElement)?.value || formData.reliabilityImprovement,
//             anyOtherAspect: getVal('input[name="otherAspects"]') || formData.anyOtherAspect,
//             objectivesOfMocHaveBeenMet: (document.querySelector('input[name="objectiveAchievement"]:checked') as HTMLInputElement)?.value || formData.objectivesOfMocHaveBeenMet,
//             comments1: getVal('textarea[name="comments"]') || formData.comments1,
//         };
//     };

//     const handlePrintPreview = () => {
//         const collectedData = collectFormData();
//         setFormData(collectedData);
//         setShowPreview(true);
//     };

//     const handleBackToForm = () => {
//         setShowPreview(false);
//     };

//     if (showPreview) {
//         return <MocPreview data={formData} onBack={handleBackToForm} />;
//     }

//     return (
//         <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[75vh] max-h-[67vh]">
//             {/* Scrollable content */}
//             <div className="p-2 overflow-y-auto flex-1">
//                 {mocSections.map((section) => (
//                     <div key={section.id} className="border rounded-lg mb-2">
//                         {/* Accordion Header */}
//                         <button
//                             onClick={() => toggleSection(section.id)}
//                             className="w-full flex items-center justify-between p-1 ml-2 bg-gray-50 hover:bg-gray-100 transition-colors"
//                         >
//                             <span className="font-semibold text-gray-800">
//                                 {section.title}
//                             </span>
//                             {expandedSections[section.id] ? (
//                                 <ChevronUp className="w-5 h-5 text-gray-600" />
//                             ) : (
//                                 <ChevronDown className="w-5 h-5 text-gray-600" />
//                             )}
//                         </button>
//                         {/* Scrollable content inside each section */}
//                         {expandedSections[section.id] && (
//                             <div className="p-3 bg-white border-t max-h-60 overflow-y-auto">
//                                 <div className="space-y-4">
//                                     {section.id === "basicInfo" && (
//                                         <>
//                                             <div className="grid grid-cols-2 gap-10 mb-5">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         MoC Request No. <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="mocNo"
//                                                         value={formData.mocNo}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Station Name <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="stationName"
//                                                         value={formData.stationName}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-10">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Date <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="relative flex items-center">
//                                                         <Calendar className="absolute left-3 text-gray-500 w-5 h-5 cursor-pointer" />
//                                                         <input
//                                                             type="date"
//                                                             name="date"
//                                                             value={formData.date}
//                                                             onChange={handleInputChange}
//                                                             className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-md 
//                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
//                  [&::-webkit-calendar-picker-indicator]:opacity-0 
//                  [&::-webkit-calendar-picker-indicator]:absolute"
//                                                             placeholder="Select date"
//                                                             readOnly={isReadOnly}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Title of the MoC <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="title"
//                                                         value={formData.title}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         placeholder="Enter the title of the MoC"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </>
//                                     )}
//                                     {section.id === "classification" && (
//                                         <div className="grid grid-cols-2 gap-10 mb-5">
//                                             <div className="space-y-5">
//                                                 <div className="relative">
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Priority <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="relative">
//                                                         <select
//                                                             name="priority"
//                                                             value={formData.priority}
//                                                             onChange={handleInputChange}
//                                                             className="w-full appearance-none px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                             disabled={isReadOnly}
//                                                         >
//                                                             <option value="">Choose</option>
//                                                             <option value="High">High</option>
//                                                             <option value="Medium">Medium</option>
//                                                             <option value="Low">Low</option>
//                                                         </select>
//                                                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Modification Type <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6 mt-1">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="modType"
//                                                                 value="Permanent"
//                                                                 checked={formData.modificationType === "Permanent"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             Permanent
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="modType"
//                                                                 value="Temporary"
//                                                                 checked={formData.modificationType === "Temporary"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             Temporary
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="space-y-5">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Time Limit in case of temporary modification
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="timeLimit"
//                                                         value={formData.timeLimit}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter time limit"
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Shutdown Required <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6 mt-1">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="shutdown"
//                                                                 value="Yes"
//                                                                 checked={formData.shutdownRequired === "Yes"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             Yes
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="shutdown"
//                                                                 value="No"
//                                                                 checked={formData.shutdownRequired === "No"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             No
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "systemDetails" && (
//                                         <div className="space-y-1">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Present System <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="presentSystem"
//                                                     value={formData.presentSystem}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the current system"
//                                                     rows={2}
//                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Proposed Changes <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="proposedChange"
//                                                     value={formData.proposedChange}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the proposed changes"
//                                                     rows={2}
//                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "justification" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Justification / Reason for Modification <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="justification"
//                                                     value={formData.objectives}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Explain why this modification is necessary"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Objective / Benefits of the Proposal <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="objectives"
//                                                     value={formData.objectives}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the expected benefits and objectives"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactOther" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Whether upstream or downstream units are also impacted <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6 mt-1">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="impactOtherUnits"
//                                                             value="Yes"
//                                                             checked={formData.upstreamDownstreamImpact === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="impactOtherUnits"
//                                                             value="No"
//                                                             checked={formData.upstreamDownstreamImpact === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         No
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="impactOtherUnits"
//                                                             value="NotApplicable"
//                                                             checked={formData.upstreamDownstreamImpact === "NotApplicable"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         Not Applicable
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "statutory" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Is any statutory approval required <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6 mt-1">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="statutoryApproval"
//                                                             value="Yes"
//                                                             checked={formData.statutoryApprovalRequired === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="statutoryApproval"
//                                                             value="No"
//                                                             checked={formData.statutoryApprovalRequired === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     If yes, please give details
//                                                 </label>
//                                                 <textarea
//                                                     name="statutoryDetails"
//                                                     value={formData.statutoryDetails}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Explain why statutory approval is required"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactAnalysis" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Impact of Modification <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="impactOfModification"
//                                                     value={formData.impactOfModification}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the potential impacts of this modification"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Consequences of Non-Implementation
//                                                 </label>
//                                                 <textarea
//                                                     name="consequencesNonImplementation"
//                                                     value={formData.consequencesOfNonImplementation}
//                                                     onChange={handleInputChange}
//                                                     placeholder="What would happen if this modification is not implemented?"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactSpecificAreas" && (
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Health, Safety & Environment <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="healthSafety"
//                                                             value="Yes"
//                                                             checked={formData.healthSafety === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="healthSafety"
//                                                             value="No"
//                                                             checked={formData.healthSafety === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Efficiency and operability <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="efficiency"
//                                                             value="Yes"
//                                                             checked={formData.efficiency === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="efficiency"
//                                                             value="No"
//                                                             checked={formData.efficiency === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Quality, Energy consumption and profit margin <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="qualityEnergy"
//                                                             value="Yes"
//                                                             checked={formData.qualityEnergy === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="qualityEnergy"
//                                                             value="No"
//                                                             checked={formData.qualityEnergy === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Reliability (Improvement of plant, machineries and equipment) <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="reliability"
//                                                             value="Yes"
//                                                             checked={formData.reliabilityImprovement === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="reliability"
//                                                             value="No"
//                                                             checked={formData.reliabilityImprovement === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 mt-2">
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Any Other Aspects:
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="otherAspects"
//                                                     value={formData.anyOtherAspect}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Please Specify"
//                                                     className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
//                                                     readOnly={isReadOnly}
//                                                 />
//                                                 <button className="bg-blue-600 text-white rounded-md px-3 py-1 hover:bg-blue-700">
//                                                     +
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "objectivesAchievement" && (
//                                         <div className="space-y-2">
//                                             <p className="text-sm text-gray-700">Whether objectives of MOC have been met</p>
//                                             {["Yes", "No", "Pending implementation"].map((option) => (
//                                                 <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
//                                                     <input
//                                                         type="radio"
//                                                         name="objectiveAchievement"
//                                                         value={option}
//                                                         checked={formData.objectivesOfMocHaveBeenMet === option}
//                                                         onChange={handleInputChange}
//                                                         className="accent-blue-600"
//                                                         disabled={isReadOnly}
//                                                     />
//                                                     {option}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//                                     {section.id === "uploadDocument" && (
//                                         <div className="space-y-3">
//                                             <p className="text-sm text-gray-700">Attach supporting documents</p>
//                                             {[
//                                                 "Process Flow Diagram - Rev 2.pdf",
//                                                 "HIRA Assessment Form.xlsx",
//                                                 "Operating Procedure SOP-101.docx",
//                                             ].map((file) => (
//                                                 <div
//                                                     key={file}
//                                                     className="flex justify-between items-center border border-gray-200 rounded-md p-2 bg-gray-50"
//                                                 >
//                                                     <div className="flex items-center gap-2 text-gray-700">
//                                                         <span className="text-blue-600">📄</span>
//                                                         <span className="text-sm">{file}</span>
//                                                     </div>
//                                                     <button className="text-gray-500 hover:text-blue-600 text-sm">⬇</button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                     {section.id === "comments" && (
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Comments
//                                             </label>
//                                             <textarea
//                                                 name="comments"
//                                                 value={formData.comments1}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter comments (if any)"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
//                                                 readOnly={isReadOnly}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//             {/* Sticky Footer */}
//             <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-2 border-t border-gray-200 shadow-inner p-7">
//                 <button
//                     onClick={handleCancel}
//                     className="px-5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     onClick={handlePrintPreview}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                     </svg>
//                     Print Preview
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     className="px-5 p-1.5 mr-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MoCRequestForm;


//new code
// "use client";

// import React, { useState, useEffect } from "react";
// import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
// import MocPreview from "./MocPreview";
// import api from "@/api/axiosInstance";

// type SectionKey =
//     | "basicInfo"
//     | "classification"
//     | "systemDetails"
//     | "justification"
//     | "impactOther"
//     | "statutory"
//     | "impactAnalysis"
//     | "impactSpecificAreas"
//     | "objectivesAchievement"
//     | "uploadDocument"
//     | "comments";

// type ExpandedSections = {
//     [K in SectionKey]: boolean;
// };

// interface MocApiResponse {
//     moc_request_no?: string;
//     station_name?: string;
//     title?: string;
//     date?: string;
//     priority?: string;
//     modification_type?: string;
//     time_limit?: string;
//     shutdown_required?: string;
//     present_system?: string;
//     proposed_change?: string;
//     justification?: string;
//     objectives?: string;
//     other_units_impacted?: string;
//     statutory_approval_required?: string;
//     statutory_approval_details?: string;
//     impact_of_modification?: string;
//     consequences_non_implementation?: string;
//     hse?: boolean;
//     efficiency?: boolean;
//     quality?: boolean;
//     reliability?: boolean;
//     other_aspects?: string;
//     objectives_achieved?: string;
//     attachments?: string;
//     comments?: string;
//     status?: string;
//     created_by?: string;
//     created_at?: string;
//     updated_at?: string;
// }

// export type MocFormData = {
//     mocNo?: string;
//     stationName?: string;
//     title?: string;
//     date?: string;
//     priority?: string;
//     modificationType?: string;
//     timeLimit?: string;
//     shutdownRequired?: string;
//     presentSystem?: string;
//     proposedChange?: string;
//     justification?: string;
//     objectives?: string;
//     upstreamDownstreamImpact?: string;
//     detailsIfAny?: string;
//     statutoryApprovalRequired?: string;
//     statutoryDetails?: string;
//     impactOfModification?: string;
//     consequencesOfNonImplementation?: string;
//     healthSafety?: string;
//     efficiency?: string;
//     qualityEnergy?: string;
//     reliabilityImprovement?: string;
//     anyOtherAspect?: string;
//     objectivesOfMocHaveBeenMet?: string;
//     attachments?: string;
//     comments1?: string;
// };

// interface MoCRequestFormProps {
//     currentStep: number;
//     handleCancel?: () => void;
//     handleNext: () => void;
//     handleBack: () => void;
//     handleSubmit: () => void;
//     mocRequestNo?: string;
//     mocData?: any;

// }

// const MoCRequestForm: React.FC<MoCRequestFormProps> = ({
//     currentStep,
//     handleCancel,
//     handleNext,
//     handleBack,
//     handleSubmit,
//     mocRequestNo,
// }) => {
//     const [formData, setFormData] = useState<MocFormData>({});
//     const [showPreview, setShowPreview] = useState(false);
//     const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
//         basicInfo: false,
//         classification: false,
//         systemDetails: false,
//         justification: false,
//         impactOther: false,
//         statutory: false,
//         impactAnalysis: false,
//         impactSpecificAreas: false,
//         objectivesAchievement: false,
//         uploadDocument: false,
//         comments: false,
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const mocRequestNoFromUrl = params.get("moc_request_no");
//         const finalMocRequestNo = mocRequestNo || mocRequestNoFromUrl;

//         console.log("✅ useEffect triggered with MOC Request No:", finalMocRequestNo);

//         if (finalMocRequestNo) {
//             fetchMocData(finalMocRequestNo);
//         } else {
//             console.warn("⚠️ mocRequestNo missing — cannot fetch data.");
//         }
//     }, [mocRequestNo]);

//     const fetchMocData = async (requestNo: string) => {
//         try {
//             setLoading(true);
//             setError(null);

//             const token = localStorage.getItem("token");

//             const res = await api.get(`/MOC/GetMocRequest`, {
//                 params: { moc_request_no: requestNo },
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             console.log("✅ API Response:", res.data);

//             const data: MocApiResponse = res.data;

//             if (!data || !data.moc_request_no) {
//                 console.error("⚠️ Empty or invalid API response for request:", requestNo);
//                 setError("No data found for this request number");
//                 return;
//             }

//             // Map other_units_impacted string to radio button value
//             let impactValue = "No";
//             if (data.other_units_impacted) {
//                 if (data.other_units_impacted === "Not Applicable") {
//                     impactValue = "NotApplicable";
//                 } else if (data.other_units_impacted.toLowerCase().includes("yes") || 
//                            data.other_units_impacted.length > 20) {
//                     impactValue = "Yes";
//                 }
//             }

//             setFormData({
//                 mocNo: data.moc_request_no || "",
//                 stationName: data.station_name || "",
//                 title: data.title || "",
//                 date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
//                 priority: data.priority || "",
//                 modificationType: data.modification_type || "",
//                 timeLimit: data.time_limit || "",
//                 shutdownRequired: data.shutdown_required || "",
//                 presentSystem: data.present_system || "",
//                 proposedChange: data.proposed_change || "",
//                 justification: data.justification || "",
//                 objectives: data.objectives || "",
//                 upstreamDownstreamImpact: impactValue,
//                 detailsIfAny: data.other_units_impacted === "Not Applicable" ? "" : data.other_units_impacted || "",
//                 statutoryApprovalRequired: data.statutory_approval_required || "",
//                 statutoryDetails: data.statutory_approval_details || "",
//                 impactOfModification: data.impact_of_modification || "",
//                 consequencesOfNonImplementation: data.consequences_non_implementation || "",
//                 healthSafety: data.hse ? "Yes" : "No",
//                 efficiency: data.efficiency ? "Yes" : "No",
//                 qualityEnergy: data.quality ? "Yes" : "No",
//                 reliabilityImprovement: data.reliability ? "Yes" : "No",
//                 anyOtherAspect: data.other_aspects || "",
//                 objectivesOfMocHaveBeenMet: data.objectives_achieved || "",
//                 attachments: data.attachments || "",
//                 comments1: data.comments || "",
//             });

//             console.log("✅ MOC Data set successfully.");
//         } catch (error: any) {
//             console.error("🚨 Failed to fetch MOC data:", error);

//             if (error?.response?.status === 404) {
//                 setError(`MOC Request ${requestNo} not found`);
//             } else if (error?.response?.status === 401) {
//                 setError("Authentication failed. Please login again.");
//             } else {
//                 setError(error?.response?.data?.message || "Failed to load MOC data");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleSection = (section: SectionKey) => {
//         setExpandedSections((prev) => ({
//             ...prev,
//             [section]: !prev[section],
//         }));
//     };

//     const mocSections: Array<{ id: SectionKey; title: string }> = [
//         { id: "basicInfo", title: "1. Basic Information" },
//         { id: "classification", title: "2. Classification" },
//         { id: "systemDetails", title: "3. System Details" },
//         { id: "justification", title: "4. Justification & Benefits" },
//         { id: "impactOther", title: "5. Impact on Other Units" },
//         { id: "statutory", title: "6. Statutory Approvals" },
//         { id: "impactAnalysis", title: "7. Impact Analysis" },
//         { id: "impactSpecificAreas", title: "8. Impact on Specific Areas" },
//         { id: "objectivesAchievement", title: "9. Objective Achievement" },
//         { id: "uploadDocument", title: "10. Upload Document" },
//         { id: "comments", title: "11. Comments(Initiator)" },
//     ];

//     const isReadOnly = true;

//     const handleInputChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//     ) => {
//         const { name, value, type } = e.target;

//         if (type === "radio") {
//             const inputElement = e.target as HTMLInputElement;
//             if (inputElement.checked) {
//                 setFormData((prev) => ({
//                     ...prev,
//                     [name]: value,
//                 }));
//             }
//         } else {
//             setFormData((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     const collectFormData = (): MocFormData => {
//         return { ...formData };
//     };

//     const handlePrintPreview = () => {
//         const collectedData = collectFormData();
//         setFormData(collectedData);
//         setShowPreview(true);
//     };

//     const handleBackToForm = () => {
//         setShowPreview(false);
//     };

//     if (showPreview) {
//         return <MocPreview data={formData} onBack={handleBackToForm} />;
//     }

//     return (
//         <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[75vh] max-h-[67vh]">
//             <div className="p-2 overflow-y-auto flex-1">
//                 {loading && (
//                     <div className="flex items-center justify-center p-8">
//                         <div className="text-center">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                             <p className="mt-4 text-gray-600">Loading MOC data...</p>
//                         </div>
//                     </div>
//                 )}

//                 {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//                         <div className="flex items-center gap-2">
//                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                             <span className="font-medium">Error: {error}</span>
//                         </div>
//                     </div>
//                 )}

//                 {!loading && !error && mocSections.map((section) => (
//                     <div key={section.id} className="border rounded-lg mb-2">
//                         <button
//                             onClick={() => toggleSection(section.id)}
//                             className="w-full flex items-center justify-between p-1 ml-2 bg-gray-50 hover:bg-gray-100 transition-colors"
//                         >
//                             <span className="font-semibold text-gray-800">{section.title}</span>
//                             {expandedSections[section.id] ? (
//                                 <ChevronUp className="w-5 h-5 text-gray-600" />
//                             ) : (
//                                 <ChevronDown className="w-5 h-5 text-gray-600" />
//                             )}
//                         </button>
//                         {expandedSections[section.id] && (
//                             <div className="p-3 bg-white border-t max-h-60 overflow-y-auto">
//                                 <div className="space-y-4">
//                                     {section.id === "basicInfo" && (
//                                         <>
//                                             <div className="grid grid-cols-2 gap-10 mb-5">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         MoC Request No. <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="mocNo"
//                                                         value={formData.mocNo || ""}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Station Name <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="stationName"
//                                                         value={formData.stationName || ""}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-10">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Date <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="relative flex items-center">
//                                                         <Calendar className="absolute left-3 text-gray-500 w-5 h-5 cursor-pointer" />
//                                                         <input
//                                                             type="date"
//                                                             name="date"
//                                                             value={formData.date || ""}
//                                                             onChange={handleInputChange}
//                                                             className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                             readOnly={isReadOnly}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Title of the MoC <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="title"
//                                                         value={formData.title || ""}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         placeholder="Enter the title of the MoC"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </>
//                                     )}
//                                     {section.id === "classification" && (
//                                         <div className="grid grid-cols-2 gap-10 mb-5">
//                                             <div className="space-y-5">
//                                                 <div className="relative">
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Priority <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="relative">
//                                                         <select
//                                                             name="priority"
//                                                             value={formData.priority || ""}
//                                                             onChange={handleInputChange}
//                                                             className="w-full appearance-none px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                             disabled={isReadOnly}
//                                                         >
//                                                             <option value="">Choose</option>
//                                                             <option value="High">High</option>
//                                                             <option value="Medium">Medium</option>
//                                                             <option value="Low">Low</option>
//                                                         </select>
//                                                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Modification Type <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6 mt-1">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="modificationType"
//                                                                 value="Permanent"
//                                                                 checked={formData.modificationType === "Permanent"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             Permanent
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="modificationType"
//                                                                 value="Temporary"
//                                                                 checked={formData.modificationType === "Temporary"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             Temporary
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="space-y-5">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Time Limit in case of temporary modification
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="timeLimit"
//                                                         value={formData.timeLimit || ""}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter time limit"
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Shutdown Required <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <div className="flex gap-6 mt-1">
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="shutdownRequired"
//                                                                 value="Yes"
//                                                                 checked={formData.shutdownRequired === "Yes"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             Yes
//                                                         </label>
//                                                         <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="shutdownRequired"
//                                                                 value="No"
//                                                                 checked={formData.shutdownRequired === "No"}
//                                                                 onChange={handleInputChange}
//                                                                 className="accent-blue-600"
//                                                                 disabled={isReadOnly}
//                                                             />
//                                                             No
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "systemDetails" && (
//                                         <div className="space-y-1">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Present System <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="presentSystem"
//                                                     value={formData.presentSystem || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the current system"
//                                                     rows={2}
//                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Proposed Changes <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="proposedChange"
//                                                     value={formData.proposedChange || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the proposed changes"
//                                                     rows={2}
//                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "justification" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Justification / Reason for Modification <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="justification"
//                                                     value={formData.justification || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Explain why this modification is necessary"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Objective / Benefits of the Proposal <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="objectives"
//                                                     value={formData.objectives || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the expected benefits and objectives"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactOther" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Whether upstream or downstream units are also impacted <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6 mt-1">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="upstreamDownstreamImpact"
//                                                             value="Yes"
//                                                             checked={formData.upstreamDownstreamImpact === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="upstreamDownstreamImpact"
//                                                             value="No"
//                                                             checked={formData.upstreamDownstreamImpact === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         No
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="upstreamDownstreamImpact"
//                                                             value="NotApplicable"
//                                                             checked={formData.upstreamDownstreamImpact === "NotApplicable"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         Not Applicable
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             {formData.upstreamDownstreamImpact === "Yes" && formData.detailsIfAny && (
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         Details
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         name="detailsIfAny"
//                                                         value={formData.detailsIfAny || ""}
//                                                         onChange={handleInputChange}
//                                                         className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                         readOnly={isReadOnly}
//                                                     />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                     {section.id === "statutory" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Is any statutory approval required <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6 mt-1">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="statutoryApprovalRequired"
//                                                             value="Yes"
//                                                             checked={formData.statutoryApprovalRequired === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="statutoryApprovalRequired"
//                                                             value="No"
//                                                             checked={formData.statutoryApprovalRequired === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         />
//                                                         No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             {formData.statutoryApprovalRequired === "Yes" && (
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                         If yes, please give details
//                                                     </label>
//                                                     <textarea
//                                                         name="statutoryDetails"
//                                                         value={formData.statutoryDetails || ""}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Explain statutory approval details"
//                                                         rows={3}
//                                                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                         readOnly={isReadOnly}
//                                                     ></textarea>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                     {section.id === "impactAnalysis" && (
//                                         <div className="space-y-5">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Impact of Modification <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <textarea
//                                                     name="impactOfModification"
//                                                     value={formData.impactOfModification || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Describe the potential impacts of this modification"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Consequences of Non-Implementation
//                                                 </label>
//                                                 <textarea
//                                                     name="consequencesOfNonImplementation"
//                                                     value={formData.consequencesOfNonImplementation || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="What would happen if this modification is not implemented?"
//                                                     rows={3}
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
//                                                     readOnly={isReadOnly}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "impactSpecificAreas" && (
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Health, Safety & Environment <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="healthSafety"
//                                                             value="Yes"
//                                                             checked={formData.healthSafety === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="healthSafety"
//                                                             value="No"
//                                                             checked={formData.healthSafety === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Efficiency and operability <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="efficiency"
//                                                             value="Yes"
//                                                             checked={formData.efficiency === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="efficiency"
//                                                             value="No"
//                                                             checked={formData.efficiency === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Quality, Energy consumption and profit margin <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="qualityEnergy"
//                                                             value="Yes"
//                                                             checked={formData.qualityEnergy === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="qualityEnergy"
//                                                             value="No"
//                                                             checked={formData.qualityEnergy === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Reliability (Improvement of plant, machineries and equipment) <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="flex gap-6">
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="reliabilityImprovement"
//                                                             value="Yes"
//                                                             checked={formData.reliabilityImprovement === "Yes"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> Yes
//                                                     </label>
//                                                     <label className="flex items-center gap-2 text-sm text-gray-700">
//                                                         <input
//                                                             type="radio"
//                                                             name="reliabilityImprovement"
//                                                             value="No"
//                                                             checked={formData.reliabilityImprovement === "No"}
//                                                             onChange={handleInputChange}
//                                                             className="accent-blue-600"
//                                                             disabled={isReadOnly}
//                                                         /> No
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 mt-2">
//                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Any Other Aspects:
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     name="anyOtherAspect"
//                                                     value={formData.anyOtherAspect || ""}
//                                                     onChange={handleInputChange}
//                                                     placeholder="Please Specify"
//                                                     className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
//                                                     readOnly={isReadOnly}
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                     {section.id === "objectivesAchievement" && (
//                                         <div className="space-y-2">
//                                             <p className="text-sm text-gray-700">Whether objectives of MOC have been met</p>
//                                             {["Yes", "No", "Pending implementation", "Partially"].map((option) => (
//                                                 <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
//                                                     <input
//                                                         type="radio"
//                                                         name="objectivesOfMocHaveBeenMet"
//                                                         value={option}
//                                                         checked={formData.objectivesOfMocHaveBeenMet === option}
//                                                         onChange={handleInputChange}
//                                                         className="accent-blue-600"
//                                                         disabled={isReadOnly}
//                                                     />
//                                                     {option}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//                                     {section.id === "uploadDocument" && (
//                                         <div className="space-y-3">
//                                             <p className="text-sm text-gray-700">Attach supporting documents</p>
//                                             {formData.attachments ? (
//                                                 <div className="flex justify-between items-center border border-gray-200 rounded-md p-2 bg-gray-50">
//                                                     <div className="flex items-center gap-2 text-gray-700">
//                                                         <span className="text-blue-600">📄</span>
//                                                         <span className="text-sm">{formData.attachments}</span>
//                                                     </div>
//                                                     <button className="text-gray-500 hover:text-blue-600 text-sm">⬇</button>
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-sm text-gray-500 italic">No attachments available</p>
//                                             )}
//                                         </div>
//                                     )}
//                                     {section.id === "comments" && (
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Comments
//                                             </label>
//                                             <textarea
//                                                 name="comments1"
//                                                 value={formData.comments1 || ""}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter comments (if any)"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
//                                                 readOnly={isReadOnly}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-2 border-t border-gray-200 shadow-inner p-7">
//                 <button
//                     onClick={handleCancel}
//                     className="px-5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     onClick={handlePrintPreview}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                     </svg>
//                     Print Preview
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     className="px-5 p-1.5 mr-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MoCRequestForm;


//updated code

import React, { useEffect, useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import MocPreview from "./MocPreview";


type SectionKey =
    | "basicInfo"
    | "classification"
    | "systemDetails"
    | "justification"
    | "impactOther"
    | "statutory"
    | "impactAnalysis"
    | "impactSpecificAreas"
    | "objectivesAchievement"
    | "uploadDocument"
    | "comments"

type ExpandedSections = {
    [K in SectionKey]: boolean;
};

export type MocFormData = {
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
    justification?:string
    preparedByName?: string;
    preparedByDesignation?: string;
    reviewedByName?: string;
    reviewedByDesignation?: string;
    approvedByName?: string;
    approvedByDesignation?: string;
    submittion_date?: string,
    status?: string;
};

interface MoCRequestFormProps {
    currentStep: number;
    handleCancel?: () => void;
    handleNext: () => void;
    handleBack: () => void;
    handleSubmit: () => void;
     mocData?: any;
}

const MoCRequestForm: React.FC<MoCRequestFormProps> = ({
    currentStep,
    handleCancel,
    handleNext,
    handleBack,
    handleSubmit,
     mocData,
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<MocFormData>({});

      useEffect(() => {
    if (mocData) {
      setFormData({
        mocNo: mocData.moc_request_no,
        stationName: mocData.station_name,
        title: mocData.title,
        date: mocData.date,
        priority: mocData.priority,
        modificationType: mocData.modification_type,
        timeLimit: mocData.time_limit,
        shutdownRequired: mocData.shutdown_required,
        presentSystem: mocData.present_system,
        proposedChange: mocData.proposed_change,
      //  additionalAdditorsIfAny: mocData.justification,
         justification: mocData.justification,
        upstreamDownstreamImpact: mocData.other_units_impacted,
        statutoryApprovalRequired: mocData.statutory_approval_required,
        statutoryDetails: mocData.statutory_approval_details,
        objectives: mocData.objectives,
        impactOfModification: mocData.impact_of_modification,
        consequencesOfNonImplementation: mocData.consequences_non_implementation,
        healthSafety: mocData.hse ? "Yes" : "No",
        efficiency: mocData.efficiency ? "Yes" : "No",
        qualityEnergy: mocData.quality ? "Yes" : "No",
        reliabilityImprovement: mocData.reliability ? "Yes" : "No",
        anyOtherAspect: mocData.other_aspects,
        objectivesOfMocHaveBeenMet: mocData.objectives_achieved,
        comments1: mocData.comments,
        submittion_date: new Date().toISOString().slice(0, 10),
    
      });
    }
  }, [mocData]);

    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        basicInfo: false,
        classification: false,
        systemDetails: false,
        justification: false,
        impactOther: false,
        statutory: false,
        impactAnalysis: false,
        impactSpecificAreas: false,
        objectivesAchievement: false,
        uploadDocument: false,
        comments: false,
    });

    const toggleSection = (section: SectionKey) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const mocSections: Array<{ id: SectionKey; title: string }> = [
        { id: "basicInfo", title: "1. Basic Information" },
        { id: "classification", title: "2. Classification" },
        { id: "systemDetails", title: "3. System Details" },
        { id: "justification", title: "4. Justification & Benefits" },
        { id: "impactOther", title: "5. Impact on Other Units" },
        { id: "statutory", title: "6. Statutory Approvals" },
        { id: "impactAnalysis", title: "7. Impact Analysis" },
        { id: "impactSpecificAreas", title: "8. Impact on Specific Areas" },
        { id: "objectivesAchievement", title: "9. Objective Achievement" },
        { id: "uploadDocument", title: "10. Upload Document" },
        { id: "comments", title: "11. Comments(Initiator)" },
    ];

    const isReadOnly = true;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        
        if (type === 'radio') {
            const inputElement = e.target as HTMLInputElement;
            if (inputElement.checked) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const collectFormData = (): MocFormData => {
        const getVal = (selector: string) => {
            const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
            return el ? el.value : "";
        };

        return {
            ...formData,
            title: getVal('input[name="title"]') || formData.title,
            date: getVal('input[name="date"]') || formData.date,
            priority: getVal('select[name="priority"]') || formData.priority,
            modificationType: (document.querySelector('input[name="modType"]:checked') as HTMLInputElement)?.value || formData.modificationType,
            shutdownRequired: (document.querySelector('input[name="shutdown"]:checked') as HTMLInputElement)?.value || formData.shutdownRequired,
            timeLimit: getVal('input[name="timeLimit"]') || formData.timeLimit,
            presentSystem: getVal('textarea[name="presentSystem"]') || formData.presentSystem,
            proposedChange: getVal('textarea[name="proposedChange"]') || formData.proposedChange,
            objectives: getVal('textarea[name="objectives"]') || formData.objectives,
             justification: getVal('textarea[name="justification"]') || formData.justification,
            upstreamDownstreamImpact: (document.querySelector('input[name="impactOtherUnits"]:checked') as HTMLInputElement)?.value || formData.upstreamDownstreamImpact,
            detailsIfAny: getVal('input[name="impactDetails"]') || formData.detailsIfAny,
            statutoryApprovalRequired: (document.querySelector('input[name="statutoryApproval"]:checked') as HTMLInputElement)?.value || formData.statutoryApprovalRequired,
            statutoryDetails: getVal('textarea[name="statutoryDetails"]') || formData.statutoryDetails,
            impactOfModification: getVal('textarea[name="impactOfModification"]') || formData.impactOfModification,
            consequencesOfNonImplementation: getVal('textarea[name="consequencesNonImplementation"]') || formData.consequencesOfNonImplementation,
            healthSafety: (document.querySelector('input[name="healthSafety"]:checked') as HTMLInputElement)?.value || formData.healthSafety,
            efficiency: (document.querySelector('input[name="efficiency"]:checked') as HTMLInputElement)?.value || formData.efficiency,
            qualityEnergy: (document.querySelector('input[name="qualityEnergy"]:checked') as HTMLInputElement)?.value || formData.qualityEnergy,
            reliabilityImprovement: (document.querySelector('input[name="reliability"]:checked') as HTMLInputElement)?.value || formData.reliabilityImprovement,
            anyOtherAspect: getVal('input[name="otherAspects"]') || formData.anyOtherAspect,
            objectivesOfMocHaveBeenMet: (document.querySelector('input[name="objectiveAchievement"]:checked') as HTMLInputElement)?.value || formData.objectivesOfMocHaveBeenMet,
            comments1: getVal('textarea[name="comments"]') || formData.comments1,
            
        };
    };

    const handlePrintPreview = () => {
        const collectedData = collectFormData();
        setFormData(collectedData);
        setShowPreview(true);
    };

    const handleBackToForm = () => {
        setShowPreview(false);
    };

    if (showPreview) {
        return <MocPreview data={formData} onBack={handleBackToForm} />;
    }

    return (
        <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[75vh] max-h-[67vh]">
            {/* Scrollable content */}
            <div className="p-2 overflow-y-auto flex-1">
                {mocSections.map((section) => (
                    <div key={section.id} className="border rounded-md mb-1 py-1 px-2">
                        {/* Accordion Header */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-1 ml-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">
                                {section.title}
                            </span>
                            {expandedSections[section.id] ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                        {/* Scrollable content inside each section */}
                        {expandedSections[section.id] && (
                            <div className="p-3 bg-white border-t max-h-60 overflow-y-auto">
                                <div className="space-y-4">
                                    {section.id === "basicInfo" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-10 mb-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        MoC Request No. <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="mocNo"
                                                        value={formData.mocNo}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        readOnly={isReadOnly}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Station Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="stationName"
                                                        value={formData.stationName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        readOnly={isReadOnly}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-10">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative flex items-center">
                                                        <Calendar className="absolute left-3 text-gray-500 w-5 h-5 cursor-pointer" />
                                                        <input
                                                            type="date"
                                                            name="date"
                                                            value={formData.date}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-md 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 [&::-webkit-calendar-picker-indicator]:opacity-0 
                 [&::-webkit-calendar-picker-indicator]:absolute"
                                                            placeholder="Select date"
                                                            readOnly={isReadOnly}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Title of the MoC <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleInputChange}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter the title of the MoC"
                                                        readOnly={isReadOnly}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {section.id === "classification" && (
                                        <div className="grid grid-cols-2 gap-10 mb-5">
                                            <div className="space-y-5">
                                                <div className="relative">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Priority <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            name="priority"
                                                            value={formData.priority}
                                                            onChange={handleInputChange}
                                                            className="w-full appearance-none px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            disabled={isReadOnly}
                                                        >
                                                            <option value="">Choose</option>
                                                            <option value="High">High</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="Low">Low</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Modification Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex gap-6 mt-1">
                                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                                            <input 
                                                                type="radio" 
                                                                name="modType" 
                                                                value="Permanent" 
                                                                checked={formData.modificationType === "Permanent"}
                                                                onChange={handleInputChange}
                                                                className="accent-blue-600" 
                                                                disabled={isReadOnly} 
                                                            />
                                                            Permanent
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                                            <input 
                                                                type="radio" 
                                                                name="modType" 
                                                                value="Temporary" 
                                                                checked={formData.modificationType === "Temporary"}
                                                                onChange={handleInputChange}
                                                                className="accent-blue-600" 
                                                                disabled={isReadOnly} 
                                                            />
                                                            Temporary
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Time Limit in case of temporary modification
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="timeLimit"
                                                        value={formData.timeLimit}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter time limit"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        readOnly={isReadOnly}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Shutdown Required <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex gap-6 mt-1">
                                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                                            <input 
                                                                type="radio" 
                                                                name="shutdown" 
                                                                value="Yes" 
                                                                checked={formData.shutdownRequired === "Yes"}
                                                                onChange={handleInputChange}
                                                                className="accent-blue-600" 
                                                                disabled={isReadOnly} 
                                                            />
                                                            Yes
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                                            <input 
                                                                type="radio" 
                                                                name="shutdown" 
                                                                value="No" 
                                                                checked={formData.shutdownRequired === "No"}
                                                                onChange={handleInputChange}
                                                                className="accent-blue-600" 
                                                                disabled={isReadOnly} 
                                                            />
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "systemDetails" && (
                                        <div className="space-y-1">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Present System <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="presentSystem"
                                                    value={formData.presentSystem}
                                                    onChange={handleInputChange}
                                                    placeholder="Describe the current system"
                                                    rows={2}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Proposed Changes <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="proposedChange"
                                                    value={formData.proposedChange}
                                                    onChange={handleInputChange}
                                                    placeholder="Describe the proposed changes"
                                                    rows={2}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "justification" && (
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Justification / Reason for Modification <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="justification"
                                                    value={formData.objectives}
                                                    onChange={handleInputChange}
                                                    placeholder="Explain why this modification is necessary"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Objective / Benefits of the Proposal <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="objectives"
                                                    value={formData.objectives}
                                                    onChange={handleInputChange}
                                                    placeholder="Describe the expected benefits and objectives"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "impactOther" && (
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Whether upstream or downstream units are also impacted <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6 mt-1">
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="impactOtherUnits" 
                                                            value="Yes" 
                                                            checked={formData.upstreamDownstreamImpact === "Yes"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        />
                                                        Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="impactOtherUnits" 
                                                            value="No" 
                                                            checked={formData.upstreamDownstreamImpact === "No"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        />
                                                        No
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="impactOtherUnits" 
                                                            value="NotApplicable" 
                                                            checked={formData.upstreamDownstreamImpact === "NotApplicable"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        />
                                                        Not Applicable
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "statutory" && (
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Is any statutory approval required <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6 mt-1">
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="statutoryApproval" 
                                                            value="Yes" 
                                                            checked={formData.statutoryApprovalRequired === "Yes"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        />
                                                        Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="statutoryApproval" 
                                                            value="No" 
                                                            checked={formData.statutoryApprovalRequired === "No"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        />
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    If yes, please give details
                                                </label>
                                                <textarea
                                                    name="statutoryDetails"
                                                    value={formData.statutoryDetails}
                                                    onChange={handleInputChange}
                                                    placeholder="Explain why statutory approval is required"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "impactAnalysis" && (
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Impact of Modification <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="impactOfModification"
                                                    value={formData.impactOfModification}
                                                    onChange={handleInputChange}
                                                    placeholder="Describe the potential impacts of this modification"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Consequences of Non-Implementation
                                                </label>
                                                <textarea
                                                    name="consequencesNonImplementation"
                                                    value={formData.consequencesOfNonImplementation}
                                                    onChange={handleInputChange}
                                                    placeholder="What would happen if this modification is not implemented?"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                    readOnly={isReadOnly}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "impactSpecificAreas" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Health, Safety & Environment <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="healthSafety" 
                                                            value="Yes" 
                                                            checked={formData.healthSafety === "Yes"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="healthSafety" 
                                                            value="No" 
                                                            checked={formData.healthSafety === "No"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Efficiency and operability <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="efficiency" 
                                                            value="Yes" 
                                                            checked={formData.efficiency === "Yes"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="efficiency" 
                                                            value="No" 
                                                            checked={formData.efficiency === "No"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quality, Energy consumption and profit margin <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="qualityEnergy" 
                                                            value="Yes" 
                                                            checked={formData.qualityEnergy === "Yes"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="qualityEnergy" 
                                                            value="No" 
                                                            checked={formData.qualityEnergy === "No"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Reliability (Improvement of plant, machineries and equipment) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="reliability" 
                                                            value="Yes" 
                                                            checked={formData.reliabilityImprovement === "Yes"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> Yes
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                                        <input 
                                                            type="radio" 
                                                            name="reliability" 
                                                            value="No" 
                                                            checked={formData.reliabilityImprovement === "No"}
                                                            onChange={handleInputChange}
                                                            className="accent-blue-600" 
                                                            disabled={isReadOnly} 
                                                        /> No
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Any Other Aspects:
                                                </label>
                                                <input
                                                    type="text"
                                                    name="otherAspects"
                                                    value={formData.anyOtherAspect}
                                                    onChange={handleInputChange}
                                                    placeholder="Please Specify"
                                                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                                                    readOnly={isReadOnly}
                                                />
                                                <button className="bg-blue-600 text-white rounded-md px-3 py-1 hover:bg-blue-700">
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {section.id === "objectivesAchievement" && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700">Whether objectives of MOC have been met</p>
                                            {["Yes", "No", "Pending implementation"].map((option) => (
                                                <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <input
                                                        type="radio"
                                                        name="objectiveAchievement"
                                                        value={option}
                                                        checked={formData.objectivesOfMocHaveBeenMet === option}
                                                        onChange={handleInputChange}
                                                        className="accent-blue-600"
                                                        disabled={isReadOnly}
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {section.id === "uploadDocument" && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-700">Attach supporting documents</p>
                                            {[
                                                "Process Flow Diagram - Rev 2.pdf",
                                                "HIRA Assessment Form.xlsx",
                                                "Operating Procedure SOP-101.docx",
                                            ].map((file) => (
                                                <div
                                                    key={file}
                                                    className="flex justify-between items-center border border-gray-200 rounded-md p-2 bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <span className="text-blue-600">📄</span>
                                                        <span className="text-sm">{file}</span>
                                                    </div>
                                                    <button className="text-gray-500 hover:text-blue-600 text-sm">⬇</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {section.id === "comments" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Comments
                                            </label>
                                            <textarea
                                                name="comments"
                                                value={formData.comments1}
                                                onChange={handleInputChange}
                                                placeholder="Enter comments (if any)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                                                readOnly={isReadOnly}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-2 border-t border-gray-200 shadow-inner p-7">
                <button
                    onClick={handleCancel}
                    className="px-5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePrintPreview}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Preview
                </button>
                <button
                    onClick={handleNext}
                    className="px-5 p-1.5 mr-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoCRequestForm;