import React from "react";

interface Props {
    initiatorName?: string;
    securityGuard?: string;
    approverName?: string;
}

const InwardApprovalSectionDisplay: React.FC<Props> = ({
    initiatorName,
    securityGuard,
    approverName
}) => {
    return (
        <section className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 mb-1">
                Approval Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

              

                {/* Security Guard */}
                <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Security Guard Name
                    </label>
                    <input
                        value={securityGuard || ""}
                        readOnly
                        className="w-full border rounded-md px-2 py-1.5 text-[12px] bg-gray-100"
                    />
                </div>

                {/* Approver Name */}
                <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Approver Name
                    </label>
                    <input
                        value={approverName || ""}
                        readOnly
                        className="w-full border rounded-md px-2 py-1.5 text-[12px] bg-gray-100"
                    />
                </div>

            </div>
        </section>
    );
};

export default InwardApprovalSectionDisplay;
