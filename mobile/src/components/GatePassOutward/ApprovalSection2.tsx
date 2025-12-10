import React from "react";
import { Approver } from "@/utils/types";   // use global type

interface ApprovalSectionProps {
  approvers: Approver[];
  initiatorName: string;
  approver_name: string;
}

const ApprovalSection2: React.FC<ApprovalSectionProps> = ({
  approvers,
  initiatorName,
  approver_name,
}) => {
  return (
    <section className="mb-3">
      <h2 className="text-sm font-bold text-gray-900 mb-1">
        Approvals (Reviewer Required)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
            Initiator Name *
          </label>
          <input
            type="text"
            value={initiatorName}
            readOnly
            className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
            Approver Name *
          </label>
          <input
            type="text"
            value={approver_name}
            readOnly
            className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-[12px]"
          />
        </div>
      </div>
    </section>
  );
};

export default ApprovalSection2;
