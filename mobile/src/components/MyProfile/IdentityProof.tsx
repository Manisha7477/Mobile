import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface IdentityProofProps {
  isActive: boolean;
  onNext?: () => void;
  profileData?: any | null;
  onValidationChange?: (isValid: boolean) => void;
}

type DocumentType = "aadhaar" | "pan" | "passport" | "drivingLicense";

interface IdentityState {
  aadhaarNumber: string;
  panNumber: string;
  drivingLicenseNumber: string;
  passportNumber: string;
}

interface FileState {
  aadhaar: File | null;
  pan: File | null;
  drivingLicense: File | null;
  passport: File | null;
}

interface FileUrlState {
  aadhaar: string | null;
  pan: string | null;
  drivingLicense: string | null;
  passport: string | null;
}

const IdentityProof: React.FC<IdentityProofProps> = ({
  isActive,
  onNext,
  onValidationChange,
}) => {
   const navigate = useNavigate();
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const userId: number | null = parsedUser?.userId || null;
  const loggedRole: string = parsedUser?.roleName || ""; // "HR" or "Employee"/Engineer/etc.

  const isHR = loggedRole === "HR";
  const isEmployee = !isHR;

  const [status, setStatus] = useState<string>(""); // Draft / Pending Approval / Approved / Rejected (backend may only send Pending Approval, others can be anything)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFirstTimeHR, setIsFirstTimeHR] = useState<boolean>(false);

  const [identityData, setIdentityData] = useState<IdentityState>({
    aadhaarNumber: "",
    panNumber: "",
    drivingLicenseNumber: "",
    passportNumber: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileState>({
    aadhaar: null,
    pan: null,
    drivingLicense: null,
    passport: null,
  });

  const [fileURLs, setFileURLs] = useState<FileUrlState>({
    aadhaar: null,
    pan: null,
    drivingLicense: null,
    passport: null,
  });

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validateForm = () => {
    const aadhaarValid =
      identityData.aadhaarNumber.trim() !== "" &&
      (!!uploadedFiles.aadhaar || !!fileURLs.aadhaar);

    const panValid =
      identityData.panNumber.trim() !== "" &&
      (!!uploadedFiles.pan || !!fileURLs.pan);

    return aadhaarValid && panValid;
  };

  useEffect(() => {
    onValidationChange?.(validateForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityData, uploadedFiles, fileURLs]);

  // -------------------------------
  // LOAD EXISTING DATA
  // -------------------------------
  useEffect(() => {
    const fetchIdentity = async () => {
      if (!userId) return;

      try {
        // Using your GET: /api/usersProfile/{user_id}
        const res = await api.get(`/api/usersProfile/${userId}`);
        const data = res.data;

        // Save current status (could be "", "Pending Approval", etc.)
        setStatus(data.status || "");

        setIdentityData({
          aadhaarNumber: data.aadhaar || "",
          panNumber: data.pan || "",
          drivingLicenseNumber: data.driving_license || "",
          passportNumber: data.passport || "",
        });

        setFileURLs({
          aadhaar: data.aadhaar_file || null,
          pan: data.pan_file || null,
          drivingLicense: data.driving_license_file || null,
          passport: data.passport_file || null,
        });

        // ----------------------------
        // FIRST TIME HR CREATION:
        // no aadhaar, no pan, no files and no status (or blank)
        // ----------------------------
        const isFirst =
          isHR &&
          !data.aadhaar &&
          !data.pan &&
          !data.aadhaar_file &&
          !data.pan_file &&
          (!data.status || data.status === "" || data.status === "Draft");

        if (isFirst) {
          setIsFirstTimeHR(true);
          setIsEditing(true); // HR should be able to type immediately
        } else {
          setIsFirstTimeHR(false);
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Failed to load identity profile", err);
      }
    };

    fetchIdentity();
  }, [userId, isHR]);

  // -------------------------------
  // INPUT HANDLERS
  // -------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setIdentityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (type: DocumentType, file: File) => {
    if (!isEditing) return;
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
    setFileURLs((prev) => ({ ...prev, [type]: null }));
  };

  const removeFile = (type: DocumentType) => {
    if (!isEditing) return;
    setUploadedFiles((prev) => ({ ...prev, [type]: null }));
    setFileURLs((prev) => ({ ...prev, [type]: null }));
  };

  const fetchFileFromURL = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const filename = url.split("/").pop() || "file";
    return new File([blob], filename);
  };

  // -------------------------------
  // API: SEND FOR APPROVAL
  // -------------------------------
  const handleSendForApproval = async () => {
    if (!userId) {
      toast.error("User ID missing");
      return;
    }

    if (!validateForm()) {
      toast.error("Aadhaar & PAN (with files) are required!");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("aadhaar", identityData.aadhaarNumber);
      fd.append("pan", identityData.panNumber);
      fd.append("driving_license", identityData.drivingLicenseNumber);
      fd.append("passport", identityData.passportNumber);

      // business: status maintained as "Pending Approval"
      fd.append("status", "Pending Approval");

      // Aadhaar file
      if (uploadedFiles.aadhaar) {
        fd.append("aadhaar_file", uploadedFiles.aadhaar);
      } else if (fileURLs.aadhaar) {
        fd.append("aadhaar_file", await fetchFileFromURL(fileURLs.aadhaar));
      }

      // PAN file
      if (uploadedFiles.pan) {
        fd.append("pan_file", uploadedFiles.pan);
      } else if (fileURLs.pan) {
        fd.append("pan_file", await fetchFileFromURL(fileURLs.pan));
      }

      // DL file
      if (uploadedFiles.drivingLicense) {
        fd.append("driving_license_file", uploadedFiles.drivingLicense);
      }

      // Passport file
      if (uploadedFiles.passport) {
        fd.append("passport_file", uploadedFiles.passport);
      }

      // your PUT api: /api/usersProfile/update?user_id={id}
      await api.put(`/api/usersProfile/update`, fd, {
        params: { user_id: userId },
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Identity sent for approval!");
      setStatus("Pending Approval");
      setIsEditing(false);
      setIsFirstTimeHR(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send for approval");
    }
  };

  // -------------------------------
  // API: REJECT (HR)
  // -------------------------------
  const handleReject = async () => {
    if (!userId) return;
    try {
      const fd = new FormData();
      fd.append("status", "Rejected");
      await api.put(`/api/usersProfile/update`, fd, {
        params: { user_id: userId },
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Rejected successfully");
      setStatus("Rejected");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Reject failed");
    }
  };

  // -------------------------------
  // PRINT PREVIEW
  // -------------------------------
  const handlePrintPreview = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>Identity Proof</title></head>
        <body>
          <h2>Identity Proof</h2>
          <p><b>Aadhaar:</b> ${identityData.aadhaarNumber}</p>
          <p><b>PAN:</b> ${identityData.panNumber}</p>
          <p><b>Driving License:</b> ${identityData.drivingLicenseNumber}</p>
          <p><b>Passport:</b> ${identityData.passportNumber}</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleBackToProfile = () => {
  if (userId) {
    navigate(`/profile`);
  } else {
    navigate("/user-management"); 
  }
};


  const handleNextClick = () => {
    if (!validateForm()) {
      toast.error("Complete Aadhaar & PAN before going Next");
      return;
    }
    onNext?.();
  };

  // -------------------------------
  // BUTTON PERMISSION LOGIC
  // -------------------------------
  const isPending = status === "Pending Approval";

  let canBack = true;
  let canEdit = false;
  let canSend = false;
  let canReject = false;
  let canPrint = false;
  let canNext = false;

  // HR – FIRST TIME (no status, no aadhaar/pan)
  if (isHR && isFirstTimeHR) {
    // HR is filling for first time
    // Inputs already editable (isEditing = true)
    canBack = true;
    canSend = true;
    canEdit = false;
    canReject = false;
    canPrint = false;
    canNext = false;
  }
  // HR – NOT FIRST TIME
  else if (isHR) {
    if (isEditing) {
      // HR actively editing (creating or reviewing)
      canBack = false;
      canEdit = false;
      canSend = true;
      canReject = true;
      canPrint = true;
      canNext = false;
    } else {
      // HR just viewing; all actions available
      canBack = true;
      canEdit = true;
      canSend = true;
      canReject = true;
      canPrint = true;
      canNext = true;
    }
  }
  // EMPLOYEE FLOW
  else if (isEmployee) {
    if (isPending && !isEditing) {
      // After HR sent for approval, employee sees data:
      // only Edit (and Back) allowed
      canBack = true;
      canEdit = true;
      canSend = false;
      canReject = false;
      canPrint = false;
      canNext = false;
    } else if (isEditing) {
      // Employee editing → can only send
      canBack = false;
      canEdit = false;
      canSend = true;
      canReject = false;
      canPrint = false;
      canNext = false;
    } else {
      // Other states (e.g. after approval): allow Next, Print
      canBack = true;
      canEdit = true;
      canSend = false;
      canReject = false;
      canPrint = true;
      canNext = true;
    }
  }

 if (!isActive) return null;
  return (
    <div className="bg-white w-full min-h-screen overflow-y-auto p-6">
      <h3 className="text-xl font-semibold mb-6">Identity Proof</h3>

      {/* Aadhaar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium">
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aadhaarNumber"
            value={identityData.aadhaarNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Upload Aadhaar <span className="text-red-500">*</span>
          </label>

          {/* Upload area */}
          {!uploadedFiles.aadhaar && !fileURLs.aadhaar ? (
            <label
              className={`mt-1 flex items-center justify-between border rounded-md px-4 py-2 ${isEditing ? "cursor-pointer" : "cursor-not-allowed bg-gray-100"
                }`}
            >
              <span className="text-sm">Upload</span>
              <Upload className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                disabled={!isEditing}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files &&
                  handleFileUpload("aadhaar", e.target.files[0])
                }
              />
            </label>
          ) : (
            <div className="mt-1 flex items-center justify-between bg-green-50 border p-2 rounded">
              <div className="flex flex-col text-xs">
                <span className="truncate">
                  {uploadedFiles.aadhaar?.name ||
                    fileURLs.aadhaar?.split("/").pop()}
                       {fileURLs.aadhaar && (
                  <a
                    href={fileURLs.aadhaar}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline mt-1 ml-5"
                  >
                    View
                  </a>
                )}
                </span>
              </div>
              {isEditing && (
                <X
                  size={14}
                  className="text-red-600 cursor-pointer"
                  onClick={() => removeFile("aadhaar")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* PAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium">
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="panNumber"
            value={identityData.panNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Upload PAN <span className="text-red-500">*</span>
          </label>

          {!uploadedFiles.pan && !fileURLs.pan ? (
            <label
              className={`mt-1 flex items-center justify-between border rounded-md px-4 py-2 ${isEditing ? "cursor-pointer" : "cursor-not-allowed bg-gray-100"
                }`}
            >
              <span className="text-sm">Upload</span>
              <Upload className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                disabled={!isEditing}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files && handleFileUpload("pan", e.target.files[0])
                }
              />
            </label>
          ) : (
            <div className="mt-1 flex items-center justify-between bg-green-50 border p-2 rounded">
              <div className="flex flex-col text-xs">
                <span className="truncate">
                  {uploadedFiles.pan?.name || fileURLs.pan?.split("/").pop()}
                     {fileURLs.aadhaar && (
                  <a
                    href={fileURLs.aadhaar}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline mt-1 ml-5"
                  >
                    View
                  </a>
                )}
                </span>
              </div>
              {isEditing && (
                <X
                  size={14}
                  className="text-red-600 cursor-pointer"
                  onClick={() => removeFile("pan")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Driving License */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium">Driving License</label>
          <input
            type="text"
            name="drivingLicenseNumber"
            value={identityData.drivingLicenseNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Upload Driving License</label>

          {!uploadedFiles.drivingLicense && !fileURLs.drivingLicense ? (
            <label
              className={`mt-1 flex items-center justify-between border rounded-md px-4 py-2 ${isEditing ? "cursor-pointer" : "cursor-not-allowed bg-gray-100"
                }`}
            >
              <span className="text-sm">Upload</span>
              <Upload className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                disabled={!isEditing}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files &&
                  handleFileUpload("drivingLicense", e.target.files[0])
                }
              />
            </label>
          ) : (
            <div className="mt-1 flex items-center justify-between bg-green-50 border p-2 rounded">
              <div className="flex flex-col text-xs">
                <span className="truncate">
                  {uploadedFiles.drivingLicense?.name ||
                    fileURLs.drivingLicense?.split("/").pop()}
                     {fileURLs.drivingLicense && (
                  <a
                    href={fileURLs.drivingLicense}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline mt-1 ml-5"
                  >
                    View
                  </a>
                )}
                </span>
              </div>
              {isEditing && (
                <X
                  size={14}
                  className="text-red-600 cursor-pointer"
                  onClick={() => removeFile("drivingLicense")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Passport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="text-sm font-medium">Passport Number</label>
          <input
            type="text"
            name="passportNumber"
            value={identityData.passportNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Upload Passport</label>

          {!uploadedFiles.passport && !fileURLs.passport ? (
            <label
              className={`mt-1 flex items-center justify-between border rounded-md px-4 py-2 ${isEditing ? "cursor-pointer" : "cursor-not-allowed bg-gray-100"
                }`}
            >
              <span className="text-sm">Upload</span>
              <Upload className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                disabled={!isEditing}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files &&
                  handleFileUpload("passport", e.target.files[0])
                }
              />
            </label>
          ) : (
            <div className="mt-1 flex items-center justify-between bg-green-50 border p-2 rounded">
              <div className="flex flex-col text-xs">
                <span className="truncate">
                  {uploadedFiles.passport?.name ||
                    fileURLs.passport?.split("/").pop()}
                </span>
                {fileURLs.passport && (
                  <a
                    href={fileURLs.passport}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline mt-1"
                  >
                    View
                  </a>
                )}
              </div>
              {isEditing && (
                <X
                  size={14}
                  className="text-red-600 cursor-pointer"
                  onClick={() => removeFile("passport")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-3 justify-end border-t pt-4">
        {/* Back */}
        <button
          type="button"
          disabled={!canBack}
          onClick={handleBackToProfile}
          className={`px-6 py-2 rounded text-sm ${canBack
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Back to Profile
        </button>

        {/* Edit */}
        <button
          type="button"
          disabled={!canEdit}
          onClick={() => setIsEditing(true)}
          className={`px-6 py-2 rounded text-sm ${canEdit
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Edit
        </button>

        {/* Send for Approval */}
        <button
          type="button"
          disabled={!canSend}
          onClick={handleSendForApproval}
          className={`px-6 py-2 rounded text-sm ${canSend
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Send for Approval
        </button>

        {/* Reject – HR only */}
        <button
          type="button"
          disabled={!canReject}
          onClick={handleReject}
          className={`px-6 py-2 rounded text-sm ${canReject
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Reject
        </button>

        {/* Print Preview */}
        <button
          type="button"
          disabled={!canPrint}
          onClick={handlePrintPreview}
          className={`px-6 py-2 rounded text-sm ${canPrint
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Print Preview
        </button>

        {/* Next */}
        <button
          type="button"
          disabled={!canNext}
          onClick={handleNextClick}
          className={`px-6 py-2 rounded text-sm ${canNext
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IdentityProof;