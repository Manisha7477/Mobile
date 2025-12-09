import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import FinalNextReviewPriview from "./FinalNextReviewPriview";
import { useNavigate } from "react-router-dom";

type SectionKey =
    | "basicInfo"
    | "hira"
    | "comments"
    | "commentHiraReviewer"
    | "commentReviewer";

type ExpandedSections = {
    [K in SectionKey]: boolean;
};

interface HiraItem {
    id: number;
    activity: string;
    hazard: string;
    risk: string;
    consequence: string;
    riskLevel: string;
    controlMeasures: string;
    commentsInitiator: string;
    commentsHiraReviewer: string;
    commentsReviewer: string;
}

export interface HiraFormData {
    mocNo: string;
    stationName: string;
    title: string;
    date: string;

    time_limit: string;   // ✅ ADD THIS

    hiraItems: HiraItem[];

    commentsInitiator: string;
    commentsHiraReviewer: string;
    commentsReviewer: string;
}


interface NextRequestFormModelProps {
    currentStep: number;
    handleCancel?: () => void;
    handleBack: () => void;
    handleSubmit: () => void;
    mocData?: any;
}

const FinalNextReviewFormModel: React.FC<NextRequestFormModelProps> = ({
    currentStep,
    handleCancel,
    handleBack,
    handleSubmit,
    mocData,
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<HiraFormData>({
        mocNo: "",
        stationName: "",
        title: "",
        date: "",
        time_limit: "", 
        hiraItems: [],
        commentsInitiator: "",
        commentsHiraReviewer: "",
        commentsReviewer: "",
    });

   const navigate = useNavigate();

    useEffect(() => {
        if (mocData) {
            console.log("🟩 Received mocData:", mocData);
            setFormData({
                mocNo: mocData.moc_request_no || "",
                stationName: mocData.station_name || "",
                title: mocData.title || "",
                date: mocData.date || "",

                time_limit: mocData.time_limit || "2025-11-07T00:00:00.000Z",
                // ✅ Main comments
                commentsInitiator: mocData.comments || "",
                commentsHiraReviewer: mocData.hira_reviewer_comments || "",
                commentsReviewer: mocData.reviewer_comments || "",

                // ✅ Map correct HIRA API array → your table format
                hiraItems: (mocData.hira_entries || []).map((item: any, index: number) => ({
                    id: index + 1,
                    activity: item.activity || "",
                    hazard: item.hazard || "",
                    risk: item.risk_level || "",
                    consequence: item.consequence || "",
                    riskLevel: item.risk_level || "",
                    controlMeasures: item.control_measures || "",
                    commentsInitiator: item.commentsInitiator || "",
                    commentsHiraReviewer: item.commentsHiraReviewer || "",


                })),
            });
        }
    }, [mocData]);

    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        basicInfo: false,
        hira: false,
        comments: false,
        commentHiraReviewer: false,
        commentReviewer: false,
    });

    const toggleSection = (section: SectionKey) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };




    //function for status change
    const updateMocStatus = async (actionType: "reject" | "send_back" | "approve") => {
        if (!mocData) return;

        const nextStatus =
            actionType === "reject" ? "Rejected" :
                actionType === "send_back" ? "Changes Request" :
                    actionType === "approve" ? "Pending Approval" :
                        mocData.status;


        const payload: any = {
            moc_request_no: mocData.moc_request_no,
            station_name: mocData.station_name,
            title: formData.title || mocData.title,
            date: formData.date || mocData.date,
            priority: mocData.priority,
            modification_type: mocData.modification_type,

            // ✅ HARDCODED FIX – backend needs a pure date string
            time_limit: mocData.time_limit || "", // ✅ ADD THIS

            // ✅ HARDCODED FIX – empty string is invalid → must be boolean
            shutdown_required: mocData.shutdown_required === true ? true : false,
            statutory_approval_required: mocData.statutory_approval_required === true ? true : false,
            objectives_achieved: mocData.objectives_achieved === true ? true : false,

            present_system: mocData.present_system,
            proposed_change: mocData.proposed_change,
            justification: mocData.justification,
            objectives: mocData.objectives,
            other_units_impacted: mocData.other_units_impacted,

            statutory_approval_details: mocData.statutory_approval_details,
            impact_of_modification: mocData.impact_of_modification,
            consequences_non_implementation: mocData.consequences_non_implementation,

            hse: mocData.hse,
            efficiency: mocData.efficiency,
            quality: mocData.quality,
            reliability: mocData.reliability,

            other_aspects: mocData.other_aspects,
            attachments: mocData.attachments,
            comments: mocData.comments,

            reviewer_comments:
                formData.commentsReviewer?.trim()
                    ? formData.commentsReviewer
                    : (mocData.reviewer_comments || ""),

            approver_comments:
                mocData.approver_comments || "",  // Hira Reviewer (read only here)

            submission_date:
                mocData.submission_date
                    ? mocData.submission_date
                    : new Date().toISOString(),


            hira_approved_date: mocData.hira_approved_date ? mocData.hira_approved_date : new Date().toISOString(),
            sic_approved_date: mocData.sic_approved_date? mocData.sic_approved_date: new Date().toISOString(),
            approved_date: mocData.approved_date,
            colsure_date: mocData.colsure_date,

            sic_comments: mocData.sic_comments || "",
            colsure_comments: mocData.colsure_comments || "",

            status: nextStatus,
            is_active: mocData.is_active,

            updated_by: localStorage.getItem("userName") || mocData.updated_by,


        };

        // ✅ Ensure time_limit is a valid date string (YYYY-MM-DD)
        if (formData.time_limit?.trim()) {
            const parsedDate = new Date(formData.time_limit);
            payload.time_limit = parsedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
        } else if (mocData.time_limit?.trim()) {
            const parsedDate = new Date(mocData.time_limit);
            payload.time_limit = parsedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
        } else {
            delete payload.time_limit; // do not send invalid/empty time_limit
        }


        try {

            const res = await api.put("/api/MOC/UpdateMocRequest", payload);

            if (res?.data?.status === "success") {
                toast.success("You are sending response after Review");
                setTimeout(() => {
                    navigate("/station-operations/moc");
                }, 1000);
            } else {
                toast.error("Failed to Send Response");
            }
        } catch (err: any) {
            toast.error(
                err?.response?.data?.detail
                    ? JSON.stringify(err.response.data.detail, null, 2)
                    : "Failed to Send Response"
            );
        }
    };



    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePrintPreview = () => {
        window.scrollTo(0, 0);
        setShowPreview(true);
    };

    const handleBackToForm = () => {
        setShowPreview(false);
        window.scrollTo(0, 0);
    };

    const mocSections: Array<{ id: SectionKey; title: string }> = [
        { id: "basicInfo", title: "1. Basic Information" },
        { id: "hira", title: "2. HIRA" },
        { id: "comments", title: "3. Comments (Initiator)" },
        { id: "commentHiraReviewer", title: "4. Comment (Hira Reviewer)" },
        { id: "commentReviewer", title: "5. Comment (Reviewer)" },
    ];

    if (showPreview) {
        return (
            <div className="w-full">
                <FinalNextReviewPriview data={formData} onBack={handleBackToForm} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[80vh] overflow-hidden">
            <div className="p-2 overflow-y-auto flex-1">
                {mocSections.map((section) => (
                    <div key={section.id} className="border rounded-lg mb-2">
                        {/* Accordion Header */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-1 ml-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800">{section.title}</span>
                            {expandedSections[section.id] ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                        {/* Section Body */}
                        {expandedSections[section.id] && (
                            <div className="p-4 bg-white border-t space-y-4">
                                {/* BASIC INFO */}
                                {section.id === "basicInfo" && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Title of The MOC. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="mocNo"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent"
                                                readOnly
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
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                MOC Request No . <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="divisionDept"
                                                value={formData.mocNo}
                                                onChange={handleInputChange}
                                                placeholder="Enter division/dept name"
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent"
                                            />
                                        </div>


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
                          focus:ring-2 focus:ring-[#0DB721] focus:border-transparent
                          [&::-webkit-calendar-picker-indicator]:opacity-0 
                          [&::-webkit-calendar-picker-indicator]:absolute"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* HIRA SECTION */}
                                {section.id === "hira" && (
                                    <div className="space-y-5">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">HIRA</h3>
                                            <p className="text-xs text-gray-500 mb-3">
                                                Hazard Identification and Risk Assessment
                                            </p>

                                            <div className="overflow-x-auto border border-gray-300 rounded-lg">
                                                <table className="min-w-full border-collapse">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">SI No.</th>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">Activity</th>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">Hazard</th>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">Risk</th>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">Consequence</th>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">Risk Level</th>
                                                            <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 text-left">
                                                                Control Measures / Mitigation Plan
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.hiraItems.map((hira, index) => (
                                                            <tr key={hira.id} className="odd:bg-white even:bg-gray-50">
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{index + 1}</td>
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{hira.activity || "N/A"}</td>
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{hira.hazard || "N/A"}</td>
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{hira.risk || "N/A"}</td>
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{hira.consequence || "N/A"}</td>
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{hira.riskLevel || "N/A"}</td>
                                                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700 whitespace-pre-line">
                                                                    {hira.controlMeasures || "N/A"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Any Particular Points
                                            </label>
                                            <textarea
                                                name="particularPoints"
                                                value={formData.particularPoints}
                                                onChange={handleInputChange}
                                                placeholder="Enter any particular points"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent resize-y"
                                            ></textarea>
                                        </div> */}
                                    </div>
                                )}

                                {/* COMMENTS SECTION */}
                                {section.id === "comments" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Comments (Initiator)
                                        </label>
                                        <textarea
                                            name="commentsInitiator"
                                            value={formData.commentsInitiator}
                                            onChange={handleInputChange}
                                            placeholder="Enter comments"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent resize-y"
                                            readOnly
                                        ></textarea>
                                    </div>
                                )}

                                {/* HIRA REVIEWER COMMENTS */}
                                {section.id === "commentHiraReviewer" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Comments (Hira Reviewer)
                                        </label>
                                        <textarea
                                            name="commentsHiraReviewer"
                                            value={formData.commentsHiraReviewer}
                                            onChange={handleInputChange}
                                            placeholder="Enter comments"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent resize-y"
                                            readOnly
                                        ></textarea>
                                    </div>
                                )}

                                {/* REVIEWER COMMENTS */}
                                {section.id === "commentReviewer" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Comments (Reviewer)
                                        </label>
                                        <textarea
                                            name="commentsReviewer"
                                            value={formData.commentsReviewer}
                                            onChange={handleInputChange}
                                            placeholder="Enter comments"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent resize-y"
                                        ></textarea>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-2 border-t border-gray-200 shadow-md">
                <button
                    onClick={handleCancel}
                    className="px-5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium border-gray-400">
                    <Image
                        src="/assets/images/prev.png"
                        alt="Previous"
                        width={15}
                        height={15}
                        className="object-contain"
                    />
                    Previous
                </button>
                <button
                    onClick={handlePrintPreview}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Preview
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => updateMocStatus("reject")}
                        className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        Reject
                    </button>
                    <button
                        onClick={() => updateMocStatus("send_back")}
                        className="px-4 py-1 bg-gray-400 text-gray-800 rounded-md hover:bg-gray-500 transition">
                        Send Back for Changes
                    </button>
                    <button
                        onClick={() => updateMocStatus("approve")}
                        className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        Send for Approval
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalNextReviewFormModel;
