

import React, { useEffect, useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import MocPreview from "../MocReview/MocPreview";


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
    station_name?: string;
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
    
     mocData?: any;
}

const MoCRequestForm: React.FC<MoCRequestFormProps> = ({
     mocData,
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<MocFormData>({});

      useEffect(() => {
    if (mocData) {
      setFormData({
        mocNo: mocData.moc_request_no,
        station_name: mocData.station_name,
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
                                                        name="station_name"
                                                        value={formData.station_name}
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
           
        </div>
    );
};

export default MoCRequestForm;
