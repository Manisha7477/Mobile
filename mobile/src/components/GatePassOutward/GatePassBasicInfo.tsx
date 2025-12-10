import React, { useState } from "react";
 
interface BasicInfoProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  showGatePassNo?: boolean;
  readOnlyMode?: boolean;
}
 
interface Field {
  label: string;
  key: string;
  required?: boolean;
  type?: string;
  validate?: (value: string) => string | null;
  placeholder?: string;
}
 
const GatePassBasicInfo: React.FC<BasicInfoProps> = ({
  formData,
  onChange,
  showGatePassNo = false,
  readOnlyMode = false,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 
  // const fields: Field[] = [
  //      { label: "Issuing Authority", key: "issuingAuthority", required: true },
  //   { label: "Department / Contractor Name", key: "contractorName", required: true },
  //   { label: "Purpose (Optional)", key: "purpose" },
  //   { label: "Address", key: "address", required: true },
  //   { label: "Material Taken By", key: "takenBy", required: true },
  //   {
  //     label: "Vehicle No",
  //     key: "vehicleNo",
  //     required: true,
  //     validate: (v) =>
  //       /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v.toUpperCase())
  //         ? null
  //         : "Invalid vehicle number (e.g., KA01AB1234)",
  //   },
  //   {
  //     label: "Driver Phone",
  //     key: "driverPhone",
  //     required: true,
  //     validate: (v) =>
  //       /^[6-9]\d{9}$/.test(v)
  //         ? null
  //         : "Enter a valid 10-digit mobile number",
  //   },
  // ];
 
const fields: Field[] = [
  {
    label: "Issuing Authority",
    key: "issuingAuthority",
    required: true,
    placeholder: "Enter issuing authority name",
  },
  {
    label: "Department / Contractor Name",
    key: "contractorName",
    required: true,
    placeholder: "Enter department / contractor name",
  },
  {
    label: "Purpose (Optional)",
    key: "purpose",
    placeholder: "Enter purpose of outward movement",
  },
  {
    label: "Address",
    key: "address",
    required: true,
    placeholder: "Enter contractor / delivery address",
  },
  {
    label: "Material Taken By",
    key: "takenBy",
    required: true,
    placeholder: "Enter the person taking the materials",
  },
  {
    label: "Vehicle No",
    key: "vehicleNo",
    required: true,
    placeholder: "e.g., KA01AB1234",
    validate: (v) =>
      /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v.toUpperCase())
        ? null
        : "Invalid vehicle number (e.g., KA01AB1234)",
  },
  {
    label: "Driver Phone",
    key: "driverPhone",
    required: true,
    placeholder: "Enter 10-digit mobile number",
    validate: (v) =>
      /^[6-9]\d{9}$/.test(v)
        ? null
        : "Enter a valid 10-digit mobile number",
  },
];
 
 
 
 
  const validateField = (key: string, value: string) => {
    const field = fields.find((f) => f.key === key);
    let error = "";
 
    if (field?.required && !value.trim()) {
      error = `${field.label} is required`;
    } else if (field?.validate) {
      const customError = field.validate(value);
      if (customError) error = customError;
    }
 
    setErrors((prev) => ({ ...prev, [key]: error }));
  };
 
  return (
    <section className="mb-1">
      <h2 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1">
        Basic Information
      </h2>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 
        {/* Gate Pass No */}
        {showGatePassNo && (
          <div>
            <label className="text-[12px] font-semibold text-gray-700 mb-1 block">
              Gate Pass No
            </label>
            <input
              type="text"
              value={formData.gatePassNo || ""}
              readOnly
              className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        )}
 
        {/* Date & Time */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => onChange("dateTime", e.target.value)}
            className="w-full border rounded-md px-2 py-1.5 text-[12px]"
          />
        </div>
 
        {/* Station Name */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
            Station Name
          </label>
          <input
            type="text"
            value={formData.station}
            readOnly
            className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>
 
     
 
        {/* Remaining Fields */}
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-[12px] font-semibold text-gray-700 mb-1 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
 
            <input
              type={field.type ?? "text"}
              value={formData[field.key] || ""}
               placeholder={field.placeholder || ""}
              disabled={readOnlyMode}
              onChange={(e) => onChange(field.key, e.target.value)}
              onBlur={(e) => validateField(field.key, e.target.value)}
              className={`w-full border rounded-md px-2 py-1.5 text-[12px] ${
                readOnlyMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors[field.key]
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors[field.key] && (
              <p className="text-red-500 text-[11px]">{errors[field.key]}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
 
export default GatePassBasicInfo;