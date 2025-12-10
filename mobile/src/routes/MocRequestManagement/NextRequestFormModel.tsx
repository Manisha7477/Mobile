"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";

type SectionKey = "basicInfo" | "hira" | "comments" | "selectHira";

type ExpandedSections = {
    [K in SectionKey]: boolean;
};

interface HiraItem {
    id: number;
    activity: string;
    hazard: string;
    riskLevel: string;
    consequence: string;
    mitigation: string;
}

interface NextRequestFormModelProps {
    currentStep: number;
    handleCancel?: () => void;
    handleNext: () => void;
    handleBack: () => void;
    handleSubmit: () => void;
    handleSave: (data: any) => void;
    mocRequestNo?: string; // ✅ props for MOC Request Number
    stationName?: string; // ✅ props for Station Name
}

interface FormErrors {
    [key: string]: string;
}

interface Engineer {
    user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    role_name?: string;
}

const NextRequestFormModel: React.FC<NextRequestFormModelProps> = ({
    currentStep,
    handleCancel,
    handleNext,
    handleBack,
    handleSubmit,
    handleSave,
    mocRequestNo,
    stationName, 
}) => {
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        basicInfo: false,
        hira: false,
        comments: false,
        selectHira: false,
    });

    const [hiraList, setHiraList] = useState<HiraItem[]>([
        { id: 1, activity: "", hazard: "", riskLevel: "", consequence: "", mitigation: "" },
    ]);

    const [formData, setFormData] = useState({
        mocRequestNo: "",
        stationName: "",
        date: "",
        title: "",
        commentsInitiator: "",
        user_id: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [loadingEngineers, setLoadingEngineers] = useState(false);

    // ✅ Set MOC Request No & Station Name from props
    useEffect(() => {
        if (mocRequestNo || stationName) {
            setFormData((prev) => ({
                ...prev,
                mocRequestNo: mocRequestNo || prev.mocRequestNo,
                stationName: stationName || prev.stationName,
            }));
        }
    }, [mocRequestNo, stationName]);
    useEffect(() => {
        if (expandedSections.selectHira && engineers.length === 0) {
            fetchEngineers();
        }
    }, [expandedSections.selectHira]);

    const fetchEngineers = async () => {
        setLoadingEngineers(true);
        try {
            const storedUser = localStorage.getItem("userData");
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const userId = parsedUser?.userId;

            if (!userId) {
                toast("User session not found. Please login again.");
                setLoadingEngineers(false);
                return;
            }

            const response = await api.get("/api/MOC/GetALlEngineersDD", {
                params: { user_id: userId },
            });

            if (response.status === 200) {
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setEngineers(data);
            } else {
                toast.error("Failed to load HIRA reviewers. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching engineers:", error);
            toast.error("Error loading HIRA reviewers. Please try again.");
        } finally {
            setLoadingEngineers(false);
        }
    };

    const toggleSection = (section: SectionKey) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const addHira = () => {
        const newId = hiraList.length + 1;
        setHiraList([
            ...hiraList,
            { id: newId, activity: "", hazard: "", riskLevel: "", consequence: "", mitigation: "" },
        ]);
    };

    const deleteHira = (id: number) => {
        setHiraList(hiraList.filter((hira) => hira.id !== id));
    };

    const updateHiraField = (id: number, field: keyof HiraItem, value: string) => {
        setHiraList((prev) =>
            prev.map((hira) => (hira.id === id ? { ...hira, [field]: value } : hira))
        );
        if (errors[`hira_${id}_${field}`]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[`hira_${id}_${field}`];
                return newErrors;
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.title.trim()) newErrors.title = "Title of MoC is required";

        hiraList.forEach((hira, index) => {
            if (!hira.activity.trim()) newErrors[`hira_${hira.id}_activity`] = `Activity is required for HIRA ${index + 1}`;
            if (!hira.hazard.trim()) newErrors[`hira_${hira.id}_hazard`] = `Hazard is required for HIRA ${index + 1}`;
            if (!hira.riskLevel) newErrors[`hira_${hira.id}_riskLevel`] = `Risk Level is required for HIRA ${index + 1}`;
            if (!hira.consequence.trim()) newErrors[`hira_${hira.id}_consequence`] = `Consequence is required for HIRA ${index + 1}`;
            if (!hira.mitigation.trim()) newErrors[`hira_${hira.id}_mitigation`] = `Control Measures are required for HIRA ${index + 1}`;
        });

        if (!formData.user_id) newErrors.user_id = "HIRA Reviewer selection is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendForReview = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const hiraPayloads = hiraList.map((hira) => ({
                moc_request_no: formData.mocRequestNo,
                activity: hira.activity,
                hazard: hira.hazard,
                consequence: hira.consequence,
                control_measures: hira.mitigation,
                risk_level: hira.riskLevel,
                comments_initiator: formData.commentsInitiator || "",
                hira_reviewer_id: parseInt(formData.user_id),
                created_by: "Admin_1", // TODO: replace with logged-in user
            }));

            const responses = await Promise.all(
                hiraPayloads.map((payload) => api.post("/HIRA/InsertHira", payload))
            );

            const allSuccessful = responses.every((res) => res.status === 200 || res.status === 201);
            if (allSuccessful) {
                toast.success("HIRA sent for review successfully!");
                handleNext();
            } else {
                toast.error("Failed to send some HIRA items for review. Please try again.");
            }
        } catch (error) {
            console.error("Error sending HIRA:", error);
            toast.error("An error occurred while sending HIRA for review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const mocSections: Array<{ id: SectionKey; title: string }> = [
        { id: "basicInfo", title: "1. Basic Information" },
        { id: "hira", title: "2. HIRA" },
        { id: "comments", title: "3. Comments" },
        { id: "selectHira", title: "4. Select HIRA Reviewer" },
    ];

    return (
        <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[80vh]">
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
                                                MoC Request No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.mocRequestNo}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent bg-gray-50"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Station Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.stationName}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent bg-gray-50"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative flex items-center">
                                                <Calendar
                                                    className="absolute left-3 text-gray-500 w-5 h-5 cursor-pointer"
                                                    onClick={() => {
                                                        const input = document.getElementById("mocDate") as HTMLInputElement | null;
                                                        input?.showPicker?.();
                                                    }}
                                                />
                                                <input
                                                    id="date"
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                                    className={`w-full pl-10 pr-2 py-1 border rounded-md 
                                                        focus:ring-2 focus:ring-[#0DB721] focus:border-transparent
                                                        [&::-webkit-calendar-picker-indicator]:opacity-0 
                                                        [&::-webkit-calendar-picker-indicator]:absolute
                                                        ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                            </div>
                                            {errors.date && (
                                                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Title of MoC <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="title"
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="Enter title of MoC"
                                                className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {/* HIRA SECTION */}
                                {section.id === "hira" && (
                                    <div className="space-y-5">
                                        {hiraList.map((hira, index) => (
                                            <div key={hira.id} className="rounded-lg relative">
                                                <div className="flex justify-between items-center mb-1 -mt-3">
                                                    <h3 className="font-semibold text-gray-800">HIRA - {index + 1}</h3>
                                                    {index > 0 && (
                                                        <button
                                                            onClick={() => deleteHira(hira.id)}
                                                            className="px-2 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-500 mb-2">
                                                    Hazard Identification and Risk Assessment
                                                </p>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Activity <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            id={`hira_${hira.id}_activity`}
                                                            type="text"
                                                            value={hira.activity}
                                                            onChange={(e) => updateHiraField(hira.id, 'activity', e.target.value)}
                                                            placeholder="Enter activity"
                                                            className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent ${errors[`hira_${hira.id}_activity`] ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {errors[`hira_${hira.id}_activity`] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[`hira_${hira.id}_activity`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Hazard <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            id={`hira_${hira.id}_hazard`}
                                                            type="text"
                                                            value={hira.hazard}
                                                            onChange={(e) => updateHiraField(hira.id, 'hazard', e.target.value)}
                                                            placeholder="Enter hazard"
                                                            className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent ${errors[`hira_${hira.id}_hazard`] ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {errors[`hira_${hira.id}_hazard`] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[`hira_${hira.id}_hazard`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Risk Level <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            id={`hira_${hira.id}_riskLevel`}
                                                            value={hira.riskLevel}
                                                            onChange={(e) => updateHiraField(hira.id, 'riskLevel', e.target.value)}
                                                            className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent ${errors[`hira_${hira.id}_riskLevel`] ? 'border-red-500' : 'border-gray-300'}`}
                                                        >
                                                            <option value="">Choose</option>
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                        </select>
                                                        {errors[`hira_${hira.id}_riskLevel`] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[`hira_${hira.id}_riskLevel`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Consequence <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            id={`hira_${hira.id}_consequence`}
                                                            type="text"
                                                            value={hira.consequence}
                                                            onChange={(e) => updateHiraField(hira.id, 'consequence', e.target.value)}
                                                            placeholder="Enter consequence"
                                                            className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent ${errors[`hira_${hira.id}_consequence`] ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {errors[`hira_${hira.id}_consequence`] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[`hira_${hira.id}_consequence`]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                                                        Control Measures / Mitigation Plan{" "}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        id={`hira_${hira.id}_mitigation`}
                                                        value={hira.mitigation}
                                                        onChange={(e) => updateHiraField(hira.id, 'mitigation', e.target.value)}
                                                        placeholder="Enter control measures or mitigation plan"
                                                        rows={2}
                                                        className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent resize-y ${errors[`hira_${hira.id}_mitigation`] ? 'border-red-500' : 'border-gray-300'}`}
                                                    ></textarea>
                                                    {errors[`hira_${hira.id}_mitigation`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`hira_${hira.id}_mitigation`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={addHira}
                                                className="px-4 py-1 bg-[#0D47A1] text-white rounded-md text-sm hover:bg-blue-800 transition"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* COMMENTS SECTION */}
                                {section.id === "comments" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Comments (Initiator)
                                        </label>
                                        <textarea
                                            value={formData.commentsInitiator}
                                            onChange={(e) => handleInputChange('commentsInitiator', e.target.value)}
                                            placeholder="Enter comments"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent resize-y"
                                        ></textarea>
                                    </div>
                                )}

                                {/* SELECT HIRA REVIEWER */}
                                {section.id === "selectHira" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select HIRA Reviewer <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="user_id"
                                            value={formData.user_id}
                                            onChange={(e) => handleInputChange('user_id', e.target.value)}
                                            disabled={loadingEngineers}
                                            className={`w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#0DB721] focus:border-transparent ${errors.hiraReviewerId ? 'border-red-500' : 'border-gray-300'} ${loadingEngineers ? 'bg-gray-100 cursor-wait' : ''}`}
                                        >
                                            <option value="">
                                                {loadingEngineers ? 'Loading reviewers...' : 'Select Reviewer'}
                                            </option>
                                            {engineers.map((engineer) => (
                                                <option key={engineer.user_id} value={engineer.user_id}>
                                                    {engineer.first_name} {engineer.last_name}
                                                    {engineer.role_name ? ` - ${engineer.role_name}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.hiraReviewerId && (
                                            <p className="text-red-500 text-xs mt-1">{errors.hiraReviewerId}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-2 border-t border-gray-200 shadow-inner">
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
                {/* <button
                    onClick={() => {
                        const data = {
                            ...formData,
                            hiraList: hiraList,
                        };
                        handleSave(data);
                    }}
                    className="border-2 flex items-center gap-2 px-6 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium border-gray-400"
                >
                    <Image
                        src="/assets/images/save.png"
                        alt="Save Draft"
                        width={12}
                        height={12}
                        className="object-contain"
                    />
                    Save Draft
                </button> */}
                <button
                    onClick={handleSendForReview}
                    disabled={isSubmitting}
                    className={`py-1 mr-3 text-white flex items-center gap-2 px-2 rounded-md transition-colors font-medium ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#0DB721] hover:bg-green-700'
                        }`}
                >
                    <Image
                        src="/assets/images/send.png"
                        alt="Send"
                        width={15}
                        height={5}
                        className="object-contain"
                    />
                    {isSubmitting ? 'Sending...' : 'Send for HIRA Review'}
                </button>
            </div>
        </div>
    );
};

export default NextRequestFormModel;