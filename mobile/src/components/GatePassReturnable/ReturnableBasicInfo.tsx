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
}

const ReturnableBasicInfo: React.FC<BasicInfoProps> = ({
    formData,
    onChange,
    showGatePassNo = false,
    readOnlyMode = false,
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

const fields: Field[] = [
    { label: "Received From", key: "contractorName", required: true },
    { label: "Supplier Address", key: "address", required: true },
    { label: "Purpose", key: "purpose", required: true },
    { label: "Reference", key: "outward_gate_pass_no", required: false },
    { label: "Driver Name", key: "driver_name", required: true },

    {
        label: "Vehicle No.",
        key: "vehicleNo",
        required: true,
        validate: (v) =>
            /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v.toUpperCase())
                ? null
                : "Invalid format (e.g., KA01AB1234)",
    },

    {
        label: "Driver Phone",
        key: "driverPhone",
        required: true,
        validate: (v) =>
            /^[6-9]\d{9}$/.test(v)
                ? null
                : "Enter a valid 10-digit mobile number",
    },
];

console.log('formData',formData);

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
        <section>
            <h2 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1">
                Basic Information
            </h2>

            {/* GRID: 3 Column Layout Same as UI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                {/* Gate Pass No */}
             
                    <div>
                        <label className="text-[12px] font-semibold text-gray-700 mb-1 block">
                            Returnable Gate Pass No.
                        </label>
                        <input
                            type="text"
                            value={formData.returnable_gate_pass_no}
                            readOnly
                            className="w-full border rounded-md px-2 py-1.5 bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>
                

                {/* Date & Time */}
                <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Date and Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => onChange("dateTime", e.target.value)}
                        disabled={readOnlyMode}
                        className={`w-full border rounded-md px-2 py-1.5 text-[12px] ${readOnlyMode ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                    />
                </div>

                {/* Department Field */}
                <div>
                    <label className="text-[12px] font-semibold text-gray-700 mb-1 block">
                        Department <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.station}
                        disabled={readOnlyMode}
                        onChange={(e) => onChange("department", e.target.value)}
                        className="w-full border rounded-md px-2 py-1.5 text-[12px]"
                    />
                </div>

                {/* Station Name (Read Only) */}
                {/* <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                        Station Name
                    </label>
                    <input
                        type="text"
                        value={formData.station}
                        readOnly
                        className="w-full border rounded-md px-2 py-1.5 bg-gray-100 cursor-not-allowed"
                    />
                </div> */}

                {/* OTHER FIELDS FROM ARRAY */}
                {fields.map((field) => (
                    <div key={field.key}>
                        <label className="text-[12px] font-semibold text-gray-700 mb-1 block">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                        </label>

                        <input
                            type={field.type ?? "text"}
                            value={formData[field.key] || ""}
                            disabled={readOnlyMode}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            onBlur={(e) => validateField(field.key, e.target.value)}
                            className={`w-full border rounded-md px-2 py-1.5 text-[12px] ${readOnlyMode
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : errors[field.key]
                                        ? "border-red-500"
                                        : "border-gray-300"
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

export default ReturnableBasicInfo;
