import useUserStore from "@/store/user";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";

interface BasicInformationProps {
  isActive: boolean;
  profileData: any | null;
  onNext: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  mobileNo: string;
  emergencyMobileNo: string;
  designation: string;
  station: string;
  station_name?: string;
  grade: string;
  supervisor: string;
  supervisor_name?: string;
  workEmail: string;
  personalEmail: string;
  employeeCode: string;
  dateOfJoining: string;
  employmentType: string; // Permanent / Probation
  permanentSince: string; // for Permanent
  probationFrom: string; // for Probation
  probationTo: string;   // for Probation
  sapLegalCode: string;
  dob: string;
  roleId: string;
}

interface DocumentItem {
  file: File | null;
  previewUrl?: string;
  fileName?: string;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  isActive,
  profileData,
  onNext,
  onValidationChange,
}) => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const loggedUsername = (user?.username || "").trim();
  const isHR = user?.roleName === "HR";

  // URL param user id (edit page will have this)
  const paramUserId = user_id ? Number(user_id) : null;

  // ---------- INITIAL MODES ----------
  const initialExistingUserId: number | null =
    profileData?.user_id ?? paramUserId ?? null;
  const initialIsCreateMode = !initialExistingUserId;

  // Track existing user ID (for PUT). After create, we will set this from API response.
  const [existingUserId, setExistingUserId] = useState<number | null>(
    initialExistingUserId
  );

  // TRUE => Create screen; FALSE => Edit screen
  const [isCreateMode, setIsCreateMode] =
    useState<boolean>(initialIsCreateMode);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // who can edit what
  const EMPLOYEE_EDITABLE = ["mobileNo", "emergencyMobileNo", "personalEmail"];

  const [isFirstTimeUser, setIsFirstTimeUser] =
    useState<boolean>(initialIsCreateMode);
  const [isExistingUser, setIsExistingUser] =
    useState<boolean>(!initialIsCreateMode);
  const [isEditing, setIsEditing] = useState<boolean>(initialIsCreateMode);

  const canEditField = (field: string) => {
    if (isHR) return isEditing; // HR can edit all while editing
    if (isCreateMode) return true; // during create screen everything editable
    // employee → limited fields only
    return isEditing && EMPLOYEE_EDITABLE.includes(field);
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    mobileNo: "",
    emergencyMobileNo: "",
    designation: "",
    station: "",
    station_name: "",
    grade: "",
    supervisor: "",
    supervisor_name: "",
    workEmail: "",
    personalEmail: "",
    employeeCode: "",
    dateOfJoining: "",
    employmentType: "",
    permanentSince: "",
    probationFrom: "",
    probationTo: "",
    sapLegalCode: "",
    dob: "",
    roleId: "",
  });

  // -------- LOAD DROPDOWNS ----------
  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        const res = await api.get("/api/super/supervisors");
        setSupervisors(res.data || []);
      } catch {
        toast.error("Failed to load supervisors");
      }
    };

    const loadStations = async () => {
      try {
        const res = await api.get("/api/stationsDD");
        setStations(res.data || []);
      } catch {
        toast.error("Failed to load stations");
      }
    };

    const loadRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data || []);
      } catch {
        toast.error("Failed to load roles");
      }
    };

    loadSupervisors();
    loadStations();
    loadRoles();
  }, []);

  // -------- PREFILL FROM profileData (EDIT MODE) ----------
  useEffect(() => {
    if (!profileData) {
      // no prefill for create – already handled via initial state
      return;
    }

    const newState: FormData = {
      firstName: profileData.first_name || "",
      lastName: profileData.last_name || "",
      gender: profileData.gender || "",
      mobileNo: profileData.contact_phone || "",
      emergencyMobileNo: profileData.emergency_mobile || "",
      designation: profileData.designation || "",
      station: profileData.station_id ? String(profileData.station_id) : "",
      station_name: profileData.station_name || "",
      grade: profileData.grade || "",
      supervisor: profileData.supervisor_id
        ? String(profileData.supervisor_id)
        : "",
      supervisor_name: profileData.supervisor_name || "",
      workEmail: profileData.email || "",
      personalEmail: profileData.personal_email || "",
      employeeCode: profileData.employee_code || "",
      dateOfJoining: profileData.date_of_joining || "",
      employmentType: profileData.employment_type || "",
      permanentSince:
        profileData.permanent_since || profileData.permanent_from || "",
      probationFrom: profileData.probation_from || "",
      probationTo: profileData.probation_to || "",
      sapLegalCode:
        profileData.sap_legal_code ?? profileData.sap_location_code ?? "",
      dob: profileData.dob || "",
      roleId: profileData.role?.role_id
        ? String(profileData.role.role_id)
        : "",
    };

    setFormData(newState);

    // ensure existing user id is set
    if (profileData.user_id) {
      setExistingUserId(profileData.user_id);
      setIsCreateMode(false); // 🔥 this is EDIT mode
    }

    if (
      Array.isArray(profileData.upload_document) &&
      profileData.upload_document.length > 0
    ) {
      const validDocs = profileData.upload_document.filter(
        (url: string) =>
          url &&
          url !== "http://122.166.153.170:8084/%7B%7D" &&
          url !== "{}" &&
          url.length > 10
      );

      const existingDocs: DocumentItem[] = validDocs.map((url: string) => ({
        file: null,
        previewUrl: url,
        fileName: url.split("/").pop() || "Document",
      }));
      setDocuments(existingDocs);
    } else {
      setDocuments([]);
    }

    // existing user
    setIsExistingUser(true);
    setIsFirstTimeUser(false);
    setIsEditing(false); // view mode initially
  }, [profileData]);

  // -------- HANDLE CHANGE ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (!canEditField(name)) return;

    if (name === "supervisor") {
      const selected = supervisors.find((s) => s.user_id == value);
      setFormData((prev) => ({
        ...prev,
        supervisor: value,
        supervisor_name: selected
          ? `${selected.first_name} ${selected.last_name}`
          : "",
      }));
      return;
    }

    if (name === "station") {
      const selected = stations.find((s) => s.station_id == value);
      setFormData((prev) => ({
        ...prev,
        station: value,
        station_name: selected?.station_name || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------- VALIDATION ----------
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.mobileNo.trim())
      newErrors.mobileNo = "Mobile number is required";

    if (!formData.personalEmail.trim())
      newErrors.personalEmail = "Personal email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.personalEmail))
      newErrors.personalEmail = "Enter a valid email";

    if (!formData.dob.trim()) newErrors.dob = "Date of birth is required";

    if (!formData.employmentType.trim())
      newErrors.employmentType = "Employment Type is required";

    if (formData.employmentType === "Permanent") {
      if (!formData.permanentSince)
        newErrors.permanentSince = "Permanent Since is required";
    }

    if (formData.employmentType === "Probation") {
      if (!formData.probationFrom)
        newErrors.probationFrom = "Probation From is required";
      if (!formData.probationTo)
        newErrors.probationTo = "Probation To is required";
    }

    if (!formData.roleId) newErrors.roleId = "User role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    onValidationChange?.(validateForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // -------- DOCUMENT HANDLERS ----------
  const handleAddDocument = () => {
    if (!isHR || !isEditing) return;
    setDocuments((prev) => [
      ...prev,
      { file: null, previewUrl: "", fileName: "No file chosen" },
    ]);
  };

  const handleDocumentFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!isHR || !isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) => {
      const updated = [...prev];
      updated[index] = {
        file,
        previewUrl: URL.createObjectURL(file),
        fileName: file.name,
      };
      return updated;
    });
  };

  const removeDocument = (index: number) => {
    if (!isHR || !isEditing) return;
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // -------- SAVE (CREATE + UPDATE) ----------
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();

      // ✅ Only for CREATE: username (unique)
      if (isCreateMode) {
        fd.append("username", formData.personalEmail || ""); // login username
      }

      // REQUIRED BASIC FIELDS (create + update)
      fd.append("email", formData.workEmail || ""); // work email
      fd.append("station_id", formData.station || "");
      fd.append("role_id", formData.roleId || "");
      fd.append("first_name", formData.firstName || "");
      fd.append("last_name", formData.lastName || "");
      fd.append("gender", formData.gender || "");
      fd.append("contact_phone", formData.mobileNo || "");
      fd.append("emergency_mobile", formData.emergencyMobileNo || "");
      fd.append("personal_email", formData.personalEmail || "");
      fd.append("employee_code", formData.employeeCode || "");
      fd.append("designation", formData.designation || "");
      fd.append("grade", formData.grade || "");
      fd.append("supervisor_id", formData.supervisor || "");
      fd.append("sap_location_code", formData.sapLegalCode || "");
      fd.append("employment_type", formData.employmentType || "");
      fd.append("date_of_joining", formData.dateOfJoining || "");
      fd.append("dob", formData.dob || "");

      // CONDITIONAL FIELDS
      if (formData.employmentType === "Permanent") {
        fd.append("permanent_from", formData.permanentSince || "");
      }

      if (formData.employmentType === "Probation") {
        fd.append("probation_from", formData.probationFrom || "");
        fd.append("probation_to", formData.probationTo || "");
      }

      // DYNAMIC created_by (string)
      const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      const createdBy =
        storedUser?.username ||
        storedUser?.userId?.toString() ||
        loggedUsername ||
        "system";
      fd.append("created_by", createdBy);

      // DOCUMENTS → match your API
      documents.forEach((doc) => {
        if (doc.file) fd.append("upload_document", doc.file);
      });

      // -------------------
      // CREATE MODE (POST)
      // -------------------
      if (isCreateMode) {
        const res = await api.post("/User/createUser", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Employee created successfully!");

        // read new user_id from response (you confirmed: res.data.user_id)
        const newUserId = res.data?.user_id;
        if (newUserId) {
          setExistingUserId(newUserId);
          setIsCreateMode(false);   // 🔥 switch to EDIT mode from now on
          setIsFirstTimeUser(false);
          setIsExistingUser(true);
        }

        setIsEditing(false);
        return;
      }

      // -------------------
      // UPDATE MODE (PUT)
      // -------------------
      const updateId = existingUserId || profileData?.user_id;

      if (!updateId) {
        toast.error("User ID missing for update!");
        return;
      }

      await api.put(`/api/usersProfile/update?user_id=${updateId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="h-[calc(100vh-160px)] overflow-y-auto hide-scrollbar pr-3">
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 text-gray-800 border-l-4 border-yellow-600 pl-3">
          Basic Information {isCreateMode && "(Create Employee)"}
        </h3>
        {loading && (
          <p className="text-sm text-gray-500 mb-3">Saving, please wait...</p>
        )}

        {/* MAIN FORM GRID (first block) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "firstName",
              label: "First Name",
              type: "text",
              required: true,
            },
            { name: "lastName", label: "Last Name", type: "text" },
            {
              name: "gender",
              label: "Gender",
              type: "select",
              required: true,
              options: ["Male", "Female", "Other"],
            },
            {
              name: "mobileNo",
              label: "Mobile No",
              type: "text",
              required: true,
            },
            {
              name: "emergencyMobileNo",
              label: "Emergency Mobile No",
              type: "text",
              required: true,
            },
            {
              name: "designation",
              label: "Designation",
              type: "text",
              required: true,
            },
            {
              name: "station",
              label: "Station",
              type: "select",
              required: true,
              options: stations.map((st) => ({
                label: st.station_name,
                value: st.station_id,
              })),
            },
            {
              name: "grade",
              label: "Grade",
              type: "select",
              required: true,
              options: [
                { label: "E1", value: "E1" },
                { label: "E2", value: "E2" },
                { label: "E3", value: "E3" },
                { label: "E4", value: "E4" },
                { label: "E5", value: "E5" },
                { label: "E6", value: "E6" },
              ],
            },
            {
              name: "supervisor",
              label: "Supervisor",
              type: "select",
              required: true,
              options: supervisors.map((s) => ({
                label: `${s.first_name} ${s.last_name}`,
                value: s.user_id,
              })),
            },
            {
              name: "workEmail",
              label: "Work Email",
              type: "email",
              required: true,
            },
            {
              name: "personalEmail",
              label: "Personal Email",
              type: "email",
              required: true,
            },
            {
              name: "employeeCode",
              label: "Employee Code",
              type: "text",
              required: true,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium -mt-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  disabled={!canEditField(field.name)}
                  value={(formData as any)[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded text-xs"
                >
                  <option value="">Select</option>
                  {Array.isArray(field.options) &&
                    field.options.map((o: any, idx: number) => (
                      <option key={idx} value={o.value ?? o}>
                        {o.label ?? o}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  disabled={!canEditField(field.name)}
                  value={(formData as any)[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded text-xs"
                />
              )}

              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ROW: DOB + DOJ + EMPLOYMENT TYPE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              disabled={!canEditField("dob")}
              value={formData.dob || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-xs"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* DOJ */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Joining
            </label>
            <input
              type="date"
              name="dateOfJoining"
              disabled={!canEditField("dateOfJoining")}
              value={formData.dateOfJoining || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-xs"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="employmentType"
              disabled={!canEditField("employmentType")}
              value={formData.employmentType || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-xs"
            >
              <option value="">Select</option>
              <option value="Permanent">Permanent</option>
              <option value="Probation">Probation</option>
            </select>
            {errors.employmentType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.employmentType}
              </p>
            )}
          </div>
        </div>

        {/* ROW: SAP + PERMANENT / PROBATION + ROLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* SAP Location Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              SAP Location Code
            </label>
            <input
              type="text"
              name="sapLegalCode"
              disabled={!canEditField("sapLegalCode")}
              value={formData.sapLegalCode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-xs"
            />
          </div>

          {/* Middle column: Permanent Since OR Probation Period */}
          <div>
            {formData.employmentType === "Permanent" && (
              <>
                <label className="block text-sm font-medium mb-1">
                  Permanent Since <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="permanentSince"
                  value={formData.permanentSince || ""}
                  disabled={!canEditField("permanentSince")}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded text-xs"
                />
                {errors.permanentSince && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.permanentSince}
                  </p>
                )}
              </>
            )}

            {formData.employmentType === "Probation" && (
              <>
                <label className="block text-sm font-medium mb-1">
                  Probation Period (From – To){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="date"
                      name="probationFrom"
                      value={formData.probationFrom || ""}
                      disabled={!canEditField("probationFrom")}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded text-xs"
                    />
                    {errors.probationFrom && (
                      <p className="text-red-500 text-xs">
                        {errors.probationFrom}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="date"
                      name="probationTo"
                      value={formData.probationTo || ""}
                      disabled={!canEditField("probationTo")}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded text-xs"
                    />
                    {errors.probationTo && (
                      <p className="text-red-500 text-xs">
                        {errors.probationTo}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Role */}
          <div>
            <label className="block text-sm font-medium mb-1">
              User Role <span className="text-red-500">*</span>
            </label>
            <select
              name="roleId"
              disabled={!canEditField("roleId")}
              value={formData.roleId}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-xs"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="text-red-500 text-xs mt-1">{errors.roleId}</p>
            )}
          </div>
        </div>

        {/* DOCUMENT SECTION */}
        <div className="mt-3 border border-blue-400 rounded-lg p-2 bg-blue-50 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Upload Document
              </h3>
              <p className="text-xs text-gray-500">
                Attach supporting documents
              </p>
            </div>

            {isHR && (
              <button
                type="button"
                disabled={!isEditing}
                onClick={handleAddDocument}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs disabled:opacity-50"
              >
                + Add
              </button>
            )}
          </div>

          {documents.length === 0 && (
            <div
              className={`border border-dashed border-gray-400 rounded-lg bg-white py-2 px-2 text-center ${
                isHR && isEditing ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={isHR && isEditing ? handleAddDocument : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 mx-auto mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 12l4-4 4 4M12 8v8"
                />
              </svg>
              <p className="text-xs text-gray-600">
                {isHR && isEditing
                  ? "Drag & drop files here or click to add"
                  : "No documents uploaded"}
              </p>
            </div>
          )}

          {documents.length > 0 && (
            <div className="mt-3 space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xs text-gray-800 flex-1 truncate">
                      {doc.fileName || "Document"}
                    </span>

                    {doc.previewUrl && (
                      <a
                        href={doc.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        View
                      </a>
                    )}

                    {isHR && isEditing && (
                      <>
                        <label
                          htmlFor={`file-${index}`}
                          className="bg-gray-200 px-3 py-1 text-xs rounded cursor-pointer hover:bg-gray-300"
                        >
                          Upload
                        </label>
                        <input
                          id={`file-${index}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleDocumentFileChange(e, index)}
                        />
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Supported: Appointment Letter, Joining Report, Verification
            Documents
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="sticky bottom-0 bg-white py-2 flex justify-end gap-3 border-t mt-4">
          {/* EDIT */}
          <button
            disabled={ isEditing}
            onClick={() => setIsEditing(true)}
            className={`px-6 py-2 rounded ${
               isEditing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Edit
          </button>

          {/* SAVE */}
          <button
            disabled={!isEditing}
            onClick={handleSave}
            className={`px-6 py-2 rounded ${
              isEditing
                ? "bg-green-600 text-white"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>

          {/* NEXT */}
          <button
            disabled={isEditing || isFirstTimeUser}
            onClick={onNext}
            className={`px-6 py-2 rounded ${
              isEditing || isFirstTimeUser
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
