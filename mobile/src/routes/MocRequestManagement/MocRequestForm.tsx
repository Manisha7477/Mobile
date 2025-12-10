"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, Save } from "lucide-react";
import { toast } from "react-toastify";

// ✅ Define allowed section keys
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
    | "comments";

interface MoCRequestFormProps {
    currentStep: number;
    handleNext: () => Promise<void>;
    handleBack: () => void;
    handleCancel: () => void;
    // handleSave: () => void; 
    onFilesSelected: (files: File[]) => void;
    uploadedFilesFromServer?: any[];
    handleSaveDraft?: () => Promise<void>;
    loading?: boolean;
    formData: MocFormData; // ✅ NEW - receive from parent
    setFormData: React.Dispatch<React.SetStateAction<MocFormData>>; // ✅ NEW
}

interface MocFormData {
    station_name: string;
    title: string;
    date: string;
    priority: string;
    modification_type: string;
    time_limit: string;
    shutdown_required: string;
    present_system: string;
    proposed_change: string;
    justification: string;
    objectives: string;
    other_units_impacted: string;
    statutory_approval_required: string;
    statutory_approval_details: string;
    impact_of_modification: string;
    consequences_non_implementation: string;
    hse: boolean;
    efficiency: boolean;
    quality: boolean;
    reliability: boolean;
    other_aspects: string;
    objectives_achieved: string;
    attachments: string;
    comments: string;
    status: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    submission_date: string
}

interface ValidationErrors {
    [key: string]: string;
}

const MoCRequestForm: React.FC<MoCRequestFormProps> = ({
    currentStep,
    handleNext,
    handleBack,
    handleCancel,
    // handleSave,
    loading = false,
    onFilesSelected,
    handleSaveDraft,
    uploadedFilesFromServer = [],
    formData,
    setFormData,

}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
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

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // ✅ Allowed file extensions
    const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // ✅ Toast notification
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleSection = (id: SectionKey) => {
        setExpandedSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // ✅ Validation Rules
    const validateField = (name: string, value: any): string => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") return "Title is required";
                if (value.length < 5) return "Title must be at least 5 characters";
                return "";

            case "date":
                if (!value) return "Date is required";
                return "";

            case "priority":
                if (!value) return "Priority is required";
                return "";

            case "modification_type":
                if (!value) return "Modification type is required";
                return "";

            case "time_limit":
                if (formData.modification_type === "Temporary" && !value) {
                    return "Time limit is required for temporary modifications";
                }
                return "";

            case "shutdown_required":
                if (!value) return "Please specify if shutdown is required";
                return "";

            case "present_system":
                if (!value || value.trim() === "") return "Present system description is required";
                if (value.length < 10) return "Please provide detailed description (min 10 characters)";
                return "";

            case "proposed_change":
                if (!value || value.trim() === "") return "Proposed change description is required";
                if (value.length < 10) return "Please provide detailed description (min 10 characters)";
                return "";

            case "justification":
                if (!value || value.trim() === "") return "Justification is required";
                if (value.length < 20) return "Please provide detailed justification (min 20 characters)";
                return "";

            case "objectives":
                if (!value || value.trim() === "") return "Objectives/Benefits are required";
                return "";

            case "other_units_impacted":
                if (!value) return "Please specify impact on other units";
                return "";

            case "statutory_approval_required":
                if (!value) return "Please specify if statutory approval is required";
                return "";

            case "statutory_approval_details":
                if (formData.statutory_approval_required === "Yes" && !value) {
                    return "Please provide statutory approval details";
                }
                return "";

            case "impact_of_modification":
                if (!value || value.trim() === "") return "Impact of modification is required";
                return "";

            case "consequences_non_implementation":
                if (!value || value.trim() === "") return "Consequences of non-implementation is required";
                return "";

            case "objectives_achieved":
                if (!value) return "Please specify if objectives were achieved";
                return "";

            case "attachments":
                if (!formData.attachments || formData.attachments === "") {
                    return "At least one document must be uploaded";
                }
                return "";

            default:
                return "";
        }
    };

    // ✅ Validate all fields
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        const fieldsToValidate = [
            "title", "date", "priority", "modification_type", "shutdown_required",
            "present_system", "proposed_change", "justification", "objectives",
            "other_units_impacted", "statutory_approval_required",
            "impact_of_modification", "consequences_non_implementation",
            "objectives_achieved", "attachments"
        ];

        if (formData.modification_type === "Temporary") {
            fieldsToValidate.push("time_limit");
        }

        if (formData.statutory_approval_required === "Yes") {
            fieldsToValidate.push("statutory_approval_details");
        }

        fieldsToValidate.forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        if (!formData.hse && !formData.efficiency && !formData.quality &&
            !formData.reliability && !formData.other_aspects) {
            newErrors.impact_areas = "Please select at least one impact area or specify other aspects";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showNotification('error', "Please fill all required fields correctly");

            // Expand sections with errors
            Object.keys(newErrors).forEach(key => {
                if (key.includes("title") || key.includes("date")) {
                    setExpandedSections(prev => ({ ...prev, basicInfo: true }));
                } else if (key.includes("priority") || key.includes("modification")) {
                    setExpandedSections(prev => ({ ...prev, classification: true }));
                } else if (key.includes("present") || key.includes("proposed")) {
                    setExpandedSections(prev => ({ ...prev, systemDetails: true }));
                } else if (key.includes("justification") || key.includes("objectives")) {
                    setExpandedSections(prev => ({ ...prev, justification: true }));
                } else if (key.includes("other_units")) {
                    setExpandedSections(prev => ({ ...prev, impactOther: true }));
                } else if (key.includes("statutory")) {
                    setExpandedSections(prev => ({ ...prev, statutory: true }));
                } else if (key.includes("impact") || key.includes("consequences")) {
                    setExpandedSections(prev => ({ ...prev, impactAnalysis: true }));
                } else if (key.includes("hse") || key.includes("impact_areas")) {
                    setExpandedSections(prev => ({ ...prev, impactSpecificAreas: true }));
                } else if (key.includes("objectives_achieved")) {
                    setExpandedSections(prev => ({ ...prev, objectivesAchievement: true }));
                } else if (key.includes("attachments")) {
                    setExpandedSections(prev => ({ ...prev, uploadDocument: true }));
                }
            });
            return false;
        }

        return true;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const { name, value } = target;

        const newValue = target instanceof HTMLInputElement && target.type === "checkbox"
            ? target.checked
            : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleBlur = (name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, (formData as any)[name]);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    // ✅ File Upload Handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];

        if (files.length === 0) return;

        const validFiles: File[] = [];
        const invalidFiles: string[] = [];

        files.forEach(file => {
            const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

            if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
                invalidFiles.push(`${file.name} - Invalid file type`);
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(`${file.name} - Exceeds 10MB limit`);
                return;
            }

            validFiles.push(file);
        });

        if (invalidFiles.length > 0) {
            showNotification('error', invalidFiles.join(', '));
        }

        if (validFiles.length > 0) {
            const newFiles = [...uploadedFiles, ...validFiles];
            setUploadedFiles(newFiles);

            const fileNamesString = newFiles.map(f => f.name).join(', ');
            setFormData((prev) => ({
                ...prev,
                attachments: fileNamesString,
            }));
            onFilesSelected(newFiles); // ✅ send validated files to parent

            showNotification('success', `${validFiles.length} file(s) uploaded successfully`);
            if (errors.attachments) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.attachments;
                    return newErrors;
                });
            }

            showNotification('success', `${validFiles.length} file(s) uploaded successfully`);
        }

        e.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);

        const fileNamesString = newFiles.map(f => f.name).join(', ');
        setFormData((prev) => ({
            ...prev,
            attachments: fileNamesString,
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const payload = { ...formData };
            showNotification('success', "MoC Request Created Successfully!");
            setTimeout(() => handleNext(), 1500);
        } catch (err: any) {
            console.error("API Error:", err);
            showNotification('error', "Something went wrong while creating request");
        }
    };

    // ✅ Error Message Component
    const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
        if (!error) return null;
        return (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>{error}</span>
            </div>
        );
    };

    //     const confirmSaveChanges = async () => {
    //   setShowConfirmModal(false);
    //   if (!handleSaveDraft) {
    //     showNotification('error', "Save draft function not available");
    //     return;
    //   }

    //   try {
    //     await handleSaveDraft(); // ✅ Call parent API
    //     showNotification('success', "Draft saved successfully!");
    //   } catch (error) {
    //     console.error("Error while saving draft:", error);
    //     showNotification('error', "Failed to save draft");
    //   }
    // };



    //  const handleSave = () => {
    //         setShowConfirmModal(true);
    //     };

    //    const confirmSaveChanges = async () => {
    //         setShowConfirmModal(false);
    //         try {

    //             try {
    //                 const payload = { ...formData };
    //                 showNotification('success', "Data save Successfully!");
    //             } catch (err: any) {
    //                 console.error("API Error:", err);
    //                 showNotification('error', "Something went wrong while saving data");
    //             }
    //         } catch (error) {
    //             console.error("Error while saving draft:", error);
    //             showNotification('error', "Something went wrong while saving");
    //         }
    //     };


    const handleSave = () => {
        setShowConfirmModal(true);
    };

    const confirmSaveChanges = async () => {
        setShowConfirmModal(false);
        if (!handleSaveDraft) {
            showNotification('error', "Save draft function not available");
            return;
        }

        try {
            await handleSaveDraft(); // ✅ Calls parent API
            showNotification('success', "Draft saved successfully!");
        } catch (error) {
            console.error("Error while saving draft:", error);
            showNotification('error', "Something went wrong while saving draft");
        }
    };


    const mocSections = [
        { id: "basicInfo" as SectionKey, title: "1. Basic Information" },
        { id: "classification" as SectionKey, title: "2. Classification" },
        { id: "systemDetails" as SectionKey, title: "3. System Details" },
        { id: "justification" as SectionKey, title: "4. Justification & Benefits" },
        { id: "impactOther" as SectionKey, title: "5. Impact on Other Units" },
        { id: "statutory" as SectionKey, title: "6. Statutory Approvals" },
        { id: "impactAnalysis" as SectionKey, title: "7. Impact Analysis" },
        { id: "impactSpecificAreas" as SectionKey, title: "8. Impact on Specific Areas" },
        { id: "objectivesAchievement" as SectionKey, title: "9. Objectives Achievement" },
        { id: "uploadDocument" as SectionKey, title: "10. Upload Documents" },
        { id: "comments" as SectionKey, title: "11. Comments" },
    ];

    return (
        <div className="bg-white rounded-b-lg shadow-lg flex flex-col h-[70vh]">
            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-1 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white animate-fade-in`}>
                    {notification.message}
                </div>
            )}
            <div className="p-1 overflow-y-auto flex-1">
                {mocSections.map((section) => (
                    <div key={section.id} className="border rounded-lg mb-2 ml-2 shadow-sm">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-0.5 pl-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-lg"
                        >
                            <span className="font-semibold text-gray-800 p-1">{section.title}</span>
                            {expandedSections[section.id] ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {expandedSections[section.id] && (
                            <div className="p-2 bg-white border-t max-h-80 overflow-y-auto">
                                {/* ✅ BASIC INFO */}
                                {section.id === "basicInfo" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-6 mb-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Station Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="station_name"
                                                    value={formData.station_name}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-50"
                                                    readOnly
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    onBlur={() => handleBlur("date")}
                                                    className={`w-full px-2 py-1 border rounded-md ${errors.date ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                <ErrorMessage error={errors.date} />
                                            </div>

                                        </div>

                                        {/* Line 2 - Title with same half-width size */}
                                        <div className="grid grid-cols-2 gap-6 mb-2">

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    onBlur={() => handleBlur("title")}
                                                    placeholder="Enter title of the modification"
                                                    className={`w-full px-2 py-1 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                <ErrorMessage error={errors.title} />
                                            </div>

                                            {/* Empty column to maintain width alignment */}
                                            <div></div>

                                        </div>
                                    </>
                                )}




                                {/* ✅ CLASSIFICATION */}
                                {section.id === "classification" && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Priority <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="priority"
                                                    value={formData.priority}
                                                    onChange={handleChange}
                                                    onBlur={() => handleBlur("priority")}
                                                    className={`w-full px-2 py-1 border rounded-md ${errors.priority ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                >
                                                    <option value="">Choose</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                                <ErrorMessage error={errors.priority} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Modification Type <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6">
                                                    {["Permanent", "Temporary"].map((type) => (
                                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="modification_type"
                                                                value={type}
                                                                checked={formData.modification_type === type}
                                                                onChange={handleChange}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMessage error={errors.modification_type} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Time Limit {formData.modification_type === "Temporary" && <span className="text-red-500">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="time_limit"
                                                    value={formData.time_limit}
                                                    onChange={handleChange}
                                                    onBlur={() => handleBlur("time_limit")}
                                                    placeholder="e.g., 6 months"
                                                    disabled={formData.modification_type !== "Temporary"}
                                                    className={`w-full px-2 py-1 border rounded-md ${formData.modification_type !== "Temporary" ? 'bg-gray-100 cursor-not-allowed' : ''
                                                        } ${errors.time_limit ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                <ErrorMessage error={errors.time_limit} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Shutdown Required <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-6">
                                                    {["Yes", "No"].map((val) => (
                                                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="shutdown_required"
                                                                value={val}
                                                                checked={formData.shutdown_required === val}
                                                                onChange={handleChange}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">{val}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMessage error={errors.shutdown_required} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ✅ SYSTEM DETAILS */}
                                {section.id === "systemDetails" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Present System <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="present_system"
                                                placeholder="Describe the current system configuration and components in detail"
                                                rows={3}
                                                value={formData.present_system}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur("present_system")}
                                                className={`w-full p-3 border rounded-md ${errors.present_system ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage error={errors.present_system} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Proposed Change <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="proposed_change"
                                                placeholder="Describe the proposed modifications and new configuration in detail"
                                                rows={3}
                                                value={formData.proposed_change}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur("proposed_change")}
                                                className={`w-full p-3 border rounded-md ${errors.proposed_change ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage error={errors.proposed_change} />
                                        </div>
                                    </div>
                                )}

                                {/* ✅ JUSTIFICATION */}
                                {section.id === "justification" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Justification / Reason for Modification <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="justification"
                                                placeholder="Provide comprehensive justification explaining why this modification is necessary"
                                                value={formData.justification}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur("justification")}
                                                rows={3}
                                                className={`w-full p-3 border rounded-md ${errors.justification ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage error={errors.justification} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Objectives / Benefits <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="objectives"
                                                placeholder="List the expected objectives, benefits, and improvements from this modification"
                                                value={formData.objectives}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur("objectives")}
                                                rows={3}
                                                className={`w-full p-3 border rounded-md ${errors.objectives ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage error={errors.objectives} />
                                        </div>
                                    </div>
                                )}

                                {/* ✅ IMPACT ON OTHER UNITS */}
                                {section.id === "impactOther" && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Whether systems of other units will also require change <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-6">
                                            {["Yes", "No", "Not Applicable"].map((val) => (
                                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="other_units_impacted"
                                                        value={val}
                                                        checked={formData.other_units_impacted === val}
                                                        onChange={handleChange}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm">{val}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <ErrorMessage error={errors.other_units_impacted} />
                                    </div>
                                )}

                                {/* ✅ STATUTORY APPROVALS */}
                                {section.id === "statutory" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Is any statutory approval required? <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-6 mb-3">
                                                {["Yes", "No"].map((val) => (
                                                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="statutory_approval_required"
                                                            value={val}
                                                            checked={formData.statutory_approval_required === val}
                                                            onChange={handleChange}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm">{val}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <ErrorMessage error={errors.statutory_approval_required} />
                                        </div>
                                        {formData.statutory_approval_required === "Yes" && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Statutory Approval Details <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="statutory_approval_details"
                                                    placeholder="Provide details about required statutory approvals and agencies"
                                                    value={formData.statutory_approval_details}
                                                    onChange={handleChange}
                                                    onBlur={() => handleBlur("statutory_approval_details")}
                                                    rows={3}
                                                    className={`w-full p-3 border rounded-md ${errors.statutory_approval_details ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                <ErrorMessage error={errors.statutory_approval_details} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ✅ IMPACT ANALYSIS */}
                                {section.id === "impactAnalysis" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Impact of Modification <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="impact_of_modification"
                                                placeholder="Describe any potential impact (positive or negative) on the plant/system"
                                                value={formData.impact_of_modification}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur("impact_of_modification")}
                                                rows={3}
                                                className={`w-full p-3 border rounded-md ${errors.impact_of_modification ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage error={errors.impact_of_modification} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Consequences of Non-Implementation <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="consequences_non_implementation"
                                                placeholder="Explain the risks or losses if the modification is not implemented"
                                                value={formData.consequences_non_implementation}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur("consequences_non_implementation")}
                                                rows={3}
                                                className={`w-full p-3 border rounded-md ${errors.consequences_non_implementation ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <ErrorMessage error={errors.consequences_non_implementation} />
                                        </div>
                                    </div>
                                )}

                                {/* ✅ IMPACT ON SPECIFIC AREAS */}
                                {section.id === "impactSpecificAreas" && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Areas Impacted by Modification <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { name: "hse", label: "HSE (Health, Safety, Environment)" },
                                                { name: "efficiency", label: "Efficiency" },
                                                { name: "quality", label: "Quality" },
                                                { name: "reliability", label: "Reliability" },
                                            ].map((item) => (
                                                <label key={item.name} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name={item.name}
                                                        checked={(formData as any)[item.name]}
                                                        onChange={handleChange}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm">{item.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Other Aspects (if any)
                                            </label>
                                            <input
                                                type="text"
                                                name="other_aspects"
                                                placeholder="Specify any other impacted aspect"
                                                value={formData.other_aspects}
                                                onChange={handleChange}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <ErrorMessage error={errors.impact_areas} />
                                    </div>
                                )}

                                {/* ✅ OBJECTIVES ACHIEVEMENT */}
                                {section.id === "objectivesAchievement" && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Were Objectives Achieved? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-6">
                                            {["Yes", "No", "Partially"].map((val) => (
                                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="objectives_achieved"
                                                        value={val}
                                                        checked={formData.objectives_achieved === val}
                                                        onChange={handleChange}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm">{val}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <ErrorMessage error={errors.objectives_achieved} />
                                    </div>
                                )}



                                {/* ✅ UPLOAD DOCUMENTS */}
                                {section.id === "uploadDocument" && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Upload Supporting Documents <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            accept=".pdf,.docx,.jpg,.jpeg,.png"
                                            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
                                        />
                                        <ErrorMessage error={errors.attachments} />

                                        {/* ✅ Show newly uploaded files */}
                                        <ul className="mt-3 space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <li key={index} className="flex justify-between items-center text-sm bg-gray-50 border p-2 rounded-md">
                                                    <span>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="text-red-600 hover:underline text-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* ✅ Show previously uploaded files — only once, in this section */}
                                        {uploadedFilesFromServer?.length > 0 && (
                                            <div className="mt-3 bg-gray-100 p-3 rounded-md border border-gray-200">
                                                <h3 className="font-semibold text-gray-700 mb-2">
                                                    Previously Uploaded Documents:
                                                </h3>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {uploadedFilesFromServer.map((file: any) => (
                                                        <li
                                                            key={file.id || file.filename}
                                                            className="text-sm flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                                                        >
                                                            <div className="flex flex-col">
                                                                <button
                                                                    type="button"
                                                                    onClick={async () => {
                                                                        try {
                                                                            if (!file.id) {
                                                                                toast.warn("Invalid file reference.");
                                                                                return;
                                                                            }

                                                                            const downloadUrl = `http://122.166.153.170:8084/moc/files/download/${file.id}`;
                                                                            const response = await fetch(downloadUrl);
                                                                            if (!response.ok) throw new Error("File not found or access denied.");

                                                                            const blob = await response.blob();
                                                                            const blobUrl = window.URL.createObjectURL(blob);

                                                                            const link = document.createElement("a");
                                                                            link.href = blobUrl;
                                                                            link.download = file.filename;
                                                                            document.body.appendChild(link);
                                                                            link.click();
                                                                            link.remove();
                                                                            window.URL.revokeObjectURL(blobUrl);

                                                                            toast.success(`Downloading ${file.filename}...`, { autoClose: 1500 });
                                                                        } catch (err) {
                                                                            console.error("❌ File download failed:", err);
                                                                            toast.error("Unable to download file. Please try again.");
                                                                        }
                                                                    }}
                                                                    className="text-blue-600 underline hover:text-blue-800 text-left"
                                                                    title="Download file"
                                                                >
                                                                    {file.filename}
                                                                </button>

                                                                {file.uploaded_at && (
                                                                    <span className="text-gray-500 text-xs">
                                                                        {new Date(file.uploaded_at).toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* ✅ COMMENTS */}
                                {section.id === "comments" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Comments
                                        </label>
                                        <textarea
                                            name="comments"
                                            placeholder="Add any other relevant remarks or comments"
                                            value={formData.comments}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ ACTION BUTTONS */}
            <div className="flex justify-between bg-gray-50 rounded-b-lg mb-2 mt-2 ml-3">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                    Cancel
                </button>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`mr-5 px-4 py-2 rounded-md text-white flex items-center gap-2 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Next" : "Next"}
                    </button>
                </div>
            </div>
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Confirm Save</h2>
                        <p className="mb-0">Are you sure you want to save this draft?</p>
                        <p className="mb-10">
                            Filled all mandatory fields for Save.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={confirmSaveChanges}
                                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                            >
                                Yes, Save
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoCRequestForm;