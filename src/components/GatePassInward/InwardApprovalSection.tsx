import React, { useState } from "react";
 
interface Approver {
    id: string;
    name: string;
}
 
interface ApprovalSectionProps {
    approvers: Approver[];
      securityGuard?: string;
    approverName?: string;
    onChange?: (data: { approverId: string; securityGuardName: string }) => void;
}
 
const InwardApprovalSection: React.FC<ApprovalSectionProps> = ({
    approvers,
    
    onChange,
}) => {
    const [approverId, setApproverId] = useState("");
    const [securityGuardName, setSecurityGuardName] = useState("");
 
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
 
                {/* Security Guard Name */}
                <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Security Guard Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={securityGuardName}
                        onChange={(e) => {
                            setSecurityGuardName(e.target.value);
                            onChange?.({
                                approverId,
                                securityGuardName: e.target.value,
                            });
                        }}
                        placeholder="Enter guard name"
                        className="w-full border rounded-md px-2 py-1.5 text-[12px]"
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
 
                            onChange?.({
                                approverId: value,
                                securityGuardName,
                            });
                        }}
                        onBlur={(e) => validateField("approverId", e.target.value)}
                        className={`w-full border rounded-md px-2 py-1.5 text-[12px] bg-white focus:ring-1 ${
                            errors.approverId
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
 
export default InwardApprovalSection;
 
 