import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";

interface BankAccountProps {
  isActive: boolean;
  profileData?: any | null;
  onNext?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface BankData {
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  accountType: string;
  file: File | string | null; // single file
}

interface BankErrors {
  [key: string]: string;
}

const BankAccount: React.FC<BankAccountProps> = ({
  isActive,
  profileData,
  onNext,
  onValidationChange,
}) => {
  const [bankData, setBankData] = useState<BankData>({
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    accountType: "",
    file: null,
  });

  const [errors, setErrors] = useState<BankErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | string | null>(null);

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  // Load profile data
  useEffect(() => {
    if (!profileData) return;
    setBankData({
      bankName: profileData.bank_name || "",
      branchName: profileData.branch_name || "",
      accountNumber: profileData.account_number || "",
      accountHolderName: profileData.account_holder_name || "",
      ifscCode: profileData.ifsc_code || "",
      accountType: profileData.account_type || "",
      file: profileData.cancelled_cheque
        ? Array.isArray(profileData.cancelled_cheque)
          ? profileData.cancelled_cheque[0]
          : profileData.cancelled_cheque
        : null,
    });
  }, [profileData]);

  // // Validate form and notify parent whenever bankData changes
  useEffect(() => {
    const newErrors: BankErrors = {};
    if (!bankData.bankName.trim()) newErrors.bankName = "Bank Name is required";
    if (!bankData.branchName.trim()) newErrors.branchName = "Branch Name is required";
    if (!bankData.accountNumber.trim()) newErrors.accountNumber = "Account Number is required";
    if (!bankData.accountHolderName.trim()) newErrors.accountHolderName = "Account Holder Name is required";
    if (!bankData.ifscCode.trim()) newErrors.ifscCode = "IFSC Code is required";
    if (!bankData.accountType.trim()) newErrors.accountType = "Account Type is required";
    if (!bankData.file) newErrors.file = "A document is required";

    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
  }, [bankData]);
    // useEffect(() => {
    //   const isValid = bankData.every((edu) => Object.keys(validateField(edu)).length === 0);
    //   onValidationChange?.(isValid);
    // }, [bankData])

  const validateForm = (): boolean => {
    const newErrors: BankErrors = {};
    if (!bankData.bankName.trim()) newErrors.bankName = "Bank Name is required";
    if (!bankData.branchName.trim()) newErrors.branchName = "Branch Name is required";
    if (!bankData.accountNumber.trim()) newErrors.accountNumber = "Account Number is required";
    if (!bankData.accountHolderName.trim()) newErrors.accountHolderName = "Account Holder Name is required";
    if (!bankData.ifscCode.trim()) newErrors.ifscCode = "IFSC Code is required";
    if (!bankData.accountType.trim()) newErrors.accountType = "Account Type is required";
    if (!bankData.file) newErrors.file = "A document is required";

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBankData({ ...bankData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed.");
      return;
    }
    setBankData({ ...bankData, file });
    setErrors({ ...errors, file: "" });
  };

  const handleRemoveFile = () => {
    setBankData({ ...bankData, file: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("bank_name", bankData.bankName);
    formData.append("branch_name", bankData.branchName);
    formData.append("account_number", bankData.accountNumber);
    formData.append("account_holder_name", bankData.accountHolderName);
    formData.append("ifsc_code", bankData.ifscCode);
    formData.append("account_type", bankData.accountType);

    if (bankData.file instanceof File) {
      formData.append("cancelled_cheque", bankData.file);
    }

    const storedUser = localStorage.getItem("userData");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser?.userId) formData.append("user_id", parsedUser.userId.toString());
    const userId = parsedUser?.userId;
    setIsSubmitting(true);
    try {
        await api.put(`/api/usersProfile/update`, formData, {
        params: { user_id: userId },   // ✅ Required fix: send in query
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Bank details updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update bank details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isActive) return null;

  return (
    <div>
      <div className="w-full mb-2">
        <div className="flex items-center gap-2 ">
          <div className="w-1 h-5 bg-yellow-400 rounded-sm"></div>
          <h2 className="text-[16px] font-semibold text-gray-800 ">Bank Details</h2>
        </div>
        <div className="border-b mt-2" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Bank Name", name: "bankName" },
            { label: "Branch Name", name: "branchName" },
            { label: "Account Number", name: "accountNumber" },
            { label: "IFSC Code", name: "ifscCode" },
            { label: "Account Holder Name", name: "accountHolderName" },
            { label: "Account Type", name: "accountType" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={field.name}
                value={(bankData as any)[field.name]}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full border rounded-md px-2 py-1 ${errors[field.name] ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-0.5">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <label className="text-sm font-medium text-gray-700 mt-4 block">
          Cancelled Cheque / Bank Statement <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={!isEditing}
        />
        <label
          htmlFor="fileUpload"
          className={`flex items-center gap-2 text-gray-600 cursor-pointer mt-1 ${!isEditing ? "cursor-not-allowed" : ""
            }`}
        >
          <span className="text-xl">⬆</span> Upload file
        </label>

        {errors.file && <p className="text-red-500 text-xs mt-0.5">{errors.file}</p>}

        <div
          className={`border rounded-md p-2 mt-2 min-h-[4rem] flex flex-col gap-2 ${errors.file ? "border-red-500" : "border-gray-300"
            } ${!isEditing ? "bg-gray-100" : "bg-white"}`}
        >
          {bankData.file ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
              <span className="text-sm text-gray-700 truncate max-w-[70%]">
                {bankData.file instanceof File
                  ? bankData.file.name
                  : bankData.file
                    ? bankData.file.split("/").pop()
                    : "file"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-xs underline text-green-700 hover:text-green-900"
                  onClick={() => {
                    const isPDF =
                      bankData.file instanceof File
                        ? bankData.file.type === "application/pdf"
                        : bankData.file?.endsWith(".pdf") ?? false;

                    if (isPDF && bankData.file) {
                      const link = document.createElement("a");
                      link.href =
                        bankData.file instanceof File ? URL.createObjectURL(bankData.file) : bankData.file;
                      link.download = bankData.file instanceof File ? bankData.file.name : "file.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else if (bankData.file) {
                      setPreviewFile(bankData.file);
                    }
                  }}
                >
                  View
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-xs underline text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No file uploaded</p>
          )}

        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            disabled={isEditing}
            onClick={() => setIsEditing(true)}
            className={`px-6 py-1 rounded-md  font-medium ${isEditing
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "text-white bg-blue-500"
              }`}
          >
            Edit
          </button>

          <button
            type="submit"
            disabled={!isEditing || isSubmitting}
            className={`px-6 py-1 rounded-md font-medium ${isEditing && !isSubmitting
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Save
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isEditing}
            className={`px-6 py-1 rounded-md font-medium ${!isEditing
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </form>

      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-4 w-3/4 max-h-[80vh] overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-red-500 font-bold text-lg"
              onClick={() => setPreviewFile(null)}
            >
              ×
            </button>
            <img
              src={previewFile instanceof File ? URL.createObjectURL(previewFile) : previewFile}
              alt="Preview"
              className="max-w-full max-h-[70vh] mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccount;