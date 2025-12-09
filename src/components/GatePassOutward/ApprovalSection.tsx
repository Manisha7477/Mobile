import React, { useState } from "react";

interface Approver {
    id: string;
    name: string;
    username: string;
    approver_id: string;
}

interface ApprovalSectionProps {
    approvers: Approver[];
    initiatorName: string;   // <-- comes from parent
    onChange?: (data: { initiatorName: string; approverId: string }) => void;
}

const ApprovalSection: React.FC<ApprovalSectionProps> = ({
    approvers,
    initiatorName,
    onChange
}) => {

    const [approverId, setApproverId] = useState("");

    const [errors, setErrors] = useState({
        approverId: "",
    });

    /** 🔥 Validate Only Approver Field */
    const validateField = (field: string, value: string) => {
        let message = "";

        if (field === "approverId" && !value.trim()) {
            message = "Please select a reviewer";
        }

        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    return (
        <section className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 mb-1">
                Approvals (Reviewer Required)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                {/* Initiator Name (Auto-filled & Readonly) */}
                <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Initiator Name
                    </label>
                    <input
                        type="text"
                        value={initiatorName}
                        readOnly
                        className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                </div>

                {/* Approver Name */}
                <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Approver Name <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={approverId}
                        onChange={(e) => {
                            const value = e.target.value;
                            setApproverId(value);
                            onChange?.({ initiatorName, approverId: value });
                        }}
                        onBlur={(e) => validateField("approverId", e.target.value)}
                        className={`w-full border rounded-md px-2 py-1.5 text-[12px] bg-white focus:ring-1 ${errors.approverId
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">Choose Reviewer</option>
                        {approvers.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>

                    {errors.approverId && (
                        <p className="text-red-500 text-[11px] mt-0.5">{errors.approverId}</p>
                    )}
                </div>

            </div>
        </section>
    );
};

export default ApprovalSection;

