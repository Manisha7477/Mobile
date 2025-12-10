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
 
const InwardGatePassBasicInfo: React.FC<BasicInfoProps> = ({
  formData,
  onChange,
  showGatePassNo = false,
  readOnlyMode = false,
}) => {
  // ✅ Validation error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // ✅ Track which fields have been touched (blurred at least once)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
 
  // ✅ Define all fields with validation rules for INWARD Gate Pass
const fields: Field[] = [
  {
    label: "PO Type",
    key: "poType",
    required: true,
    placeholder: "Select PO Type"
  },
 
  {
    label: "Received From",
    key: "receivedFrom",
    required: true,
    placeholder: "Enter supplier or person name"
  },
 
  {
    label: "PO Number",
    key: "poNumber",
    required: false,
    placeholder: "Enter PO Number (optional)"
  },
 
  {
    label: "Supplier Address",
    key: "supplierAddress",
    required: false,
    placeholder: "Enter full supplier address"
  },
 
  {
    label: "Reference Document",
    key: "referenceDoc",
    required: false,
    placeholder: "Enter reference document No (optional)"
  },
 
  {
    label: "Purpose",
    key: "purpose",
    required: true,
    placeholder: "Enter purpose of inward materials"
  },
 
  {
    label: "Vehicle No",
    key: "vehicleNo",
    required: false,
    placeholder: "e.g., KA01AB1234",
    validate: (v) =>
      v?.trim() && !/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v.toUpperCase())
        ? "Invalid vehicle number (e.g., KA01AB1234)"
        : null,
  },
 
  {
    label: "Driver Name",
    key: "driverName",
    required: false,
    placeholder: "Enter driver name (optional)"
  },
 
  {
    label: "Driver Phone",
    key: "driverPhone",
    required: false,
    placeholder: "Enter 10-digit driver phone",
    validate: (v) =>
      v.trim() && !/^[6-9]\d{9}$/.test(v)
        ? "Enter a valid 10-digit mobile number"
        : null,
  },
];
 
 
  /** ✅ Validate a single field */
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
 
  /** ✅ Mark field as touched on blur */
  const handleBlur = (key: string, value: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key, value);
  };
 
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold text-gray-900 mb-4 border-b pb-2">
        Basic Information
      </h2>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ✅ Gate Pass No - with red alert box */}
        {showGatePassNo && (
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Gate Pass No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              value={formData?.gatePassNo || ""}
              placeholder="Auto-generated"
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-[12px] bg-gray-50 text-gray-700 font-medium cursor-not-allowed"
            />
          </div>
        )}
 
        {/* ✅ Date and Time (required) */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData?.dateTime || ""}
            onChange={(e) => {
              onChange("dateTime", e.target.value);
              // validate live only if already touched
              if (touched.dateTime) {
                validateField("dateTime", e.target.value);
              }
            }}
            onBlur={(e) => handleBlur("dateTime", e.target.value)}
            className={`w-full border rounded-md px-2 py-1.5 text-[12px] ${
              touched.dateTime && errors.dateTime
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {touched.dateTime && errors.dateTime && (
            <p className="text-red-500 text-[11px] mt-0.5">
              {errors.dateTime}
            </p>
          )}
        </div>
 
        {/* ✅ Station Name */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">
            Station Name
          </label>
          <input
            type="text"
            value={formData?.station || ""}
            readOnly
            className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>
 
        {/* ✅ Remaining Fields - Dynamic */}
        {fields.map((field, i) => (
          <div key={field.key}>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
 
            {field.key === "poType" ? (
              <select
                value={formData?.[field.key] || ""}
                onChange={(e) => {
                  onChange(field.key, e.target.value);
                  if (touched[field.key]) {
                    validateField(field.key, e.target.value);
                  }
                }}
                onBlur={(e) => handleBlur(field.key, e.target.value)}
                className={`w-full border rounded-md px-2 py-2 text-[12px] focus:ring-1 bg-white ${
                  touched[field.key] && errors[field.key]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">-- Select --</option>
                <option value="With PO">With PO</option>
                <option value="Without PO">Without PO</option>
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                value={formData?.[field.key] || ""}
                onChange={(e) => {
                  onChange(field.key, e.target.value);
                  if (touched[field.key]) {
                    validateField(field.key, e.target.value);
                  }
                }}
                onBlur={(e) => handleBlur(field.key, e.target.value)}
                placeholder={field.placeholder}
 
                className={`w-full border rounded-md px-2 py-2 text-[12px] focus:ring-1 ${
                  touched[field.key] && errors[field.key]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            )}
 
            {touched[field.key] && errors[field.key] && (
              <p className="text-red-500 text-[11px] mt-0.5">
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
 
export default InwardGatePassBasicInfo;