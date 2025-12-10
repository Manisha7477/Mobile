import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";

interface EducationProps {
  isActive: boolean;
  onNext?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  profileData?: any | null;
}

interface EducationItem {
  id: number;
  qualification: string;
  year: string;
  document?: File | string | null;
  education_id?: number | null;
  optional?: boolean;
  errors?: {
    qualification?: string;
    year?: string;
    document?: string;
  };
}

const Education: React.FC<EducationProps> = ({ isActive, onNext, onValidationChange, profileData }) => {
  const defaultRows: EducationItem[] = [
    { id: 1, qualification: "", year: "", document: null, optional: false, education_id: null, errors: {} },
    { id: 2, qualification: "", year: "", document: null, optional: false, education_id: null, errors: {} },
    { id: 3, qualification: "", year: "", document: null, optional: false, education_id: null, errors: {} },
    { id: 4, qualification: "", year: "", document: null, optional: true, education_id: null, errors: {} },
    { id: 5, qualification: "", year: "", document: null, optional: true, education_id: null, errors: {} },
  ];

  const [educationList, setEducationList] = useState<EducationItem[]>(defaultRows);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const isDisabled = isExistingUser && !isEditing;

  // Load profile data
  useEffect(() => {
    if (!profileData) return;
    const eduFromProfile = defaultRows.map((row, idx) => {
      const profileEdu = profileData.education?.[idx];
      return {
        ...row,
        qualification: profileEdu?.qualification || "",
        year: profileEdu?.year_of_completion?.toString() || "",
        document: profileEdu?.education_document || null,
        education_id: profileEdu?.education_id || null,
      };
    });
    setEducationList(eduFromProfile);
  }, [profileData]);

  // Fetch education from API
  useEffect(() => {
    if (!isActive) return;
    const fetchEducation = async () => {
      try {
        const storedUser = localStorage.getItem("userData");
        const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
        if (!userId) return;

        const res = await api.get(`/api/education/user/${userId}`);
        const data = res.data;
        if (!data || data.length === 0) {
          setIsFirstTimeUser(true);
          setIsExistingUser(false);
          setIsEditing(true);
          return;
        }

        setIsExistingUser(true);
        setIsEditing(false);
        setIsFirstTimeUser(false);

        const getFileURL = (path: string) =>
          path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path.replace("\\", "/")}`;

        const eduList = defaultRows.map((row, idx) => {
          const apiEdu = data[idx];
          return {
            ...row,
            qualification: apiEdu?.qualification || "",
            year: apiEdu?.year_of_completion?.toString() || "",
            document: apiEdu?.education_document ? getFileURL(apiEdu.education_document) : null,
            education_id: apiEdu?.education_id || null,
          };
        });

        setEducationList(eduList);
      } catch (err) {
        console.error("Failed to fetch", err);
        toast.error("Failed to fetch education");
      }
    };

    fetchEducation();
  }, [isActive]);

  // Validation
  const validateField = (edu: EducationItem, idx: number) => {
    const errors: any = {};
    if (idx < 3) {
      if (!edu.qualification.trim()) errors.qualification = "Qualification is required";
      if (!edu.year.trim()) errors.year = "Year is required";
      else if (!/^\d{4}$/.test(edu.year)) errors.year = "Enter a valid year";
      if (!edu.document) errors.document = "Document is required";
    } else {
      // Optional rows: validate only if user fills something
      if (edu.qualification || edu.year || edu.document) {
        if (!edu.qualification.trim()) errors.qualification = "Qualification is required";
        if (!edu.year.trim()) errors.year = "Year is required";
        else if (!/^\d{4}$/.test(edu.year)) errors.year = "Enter a valid year";
        if (!edu.document) errors.document = "Document is required";
      }
    }
    return errors;
  };

  useEffect(() => {
    const isValid = educationList.every((edu, idx) => Object.keys(validateField(edu, idx)).length === 0);
    onValidationChange?.(isValid);
  }, [educationList]);

  const handleChange = (id: number, field: keyof EducationItem, value: any) => {
    setEducationList((prev) => prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  const handleNext = () => {
    const updated = educationList.map((edu, idx) => ({ ...edu, errors: validateField(edu, idx) }));
    setEducationList(updated);

    const top3Valid = updated.slice(0, 3).every((edu) => Object.keys(edu.errors || {}).length === 0);
    if (!top3Valid) return toast.error("Please fill all mandatory fields in top 3 rows.");
    onNext?.();
  };

  const handleSubmit = async () => {
    const updated = educationList.map((edu, idx) => ({ ...edu, errors: validateField(edu, idx) }));
    setEducationList(updated);

    const top3Valid = updated.slice(0, 3).every((edu) => Object.keys(edu.errors || {}).length === 0);
    if (!top3Valid) {
      toast.error("Please fill all mandatory fields in top 3 rows.");
      return;
    }

    const stored = localStorage.getItem("userData");
    const userId = stored ? JSON.parse(stored)?.userId : null;
    if (!userId) return toast.error("User not found");

    setIsSubmitting(true);

    try {
      for (const edu of educationList) {
        if (edu.optional && !edu.qualification && !edu.year && !edu.document) continue;

        const formData = new FormData();
        formData.append("user_id", userId.toString());
        formData.append("qualification", edu.qualification);
        formData.append("year_of_completion", edu.year);

        if (edu.document instanceof File) {
          formData.append("document", edu.document);
        } else if (typeof edu.document === "string") {
          const docPath = edu.document.replace(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`, "");
          formData.append("document", docPath);
        }

        if (edu.education_id) {
          await api.put(`/api/education/${edu.education_id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post(`/api/education`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      toast.success("Education saved successfully!");
      setIsEditing(false);
      setIsExistingUser(true);
      setIsFirstTimeUser(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save education");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar pb-20 bg-white p-4 rounded-lg shadow text-xs">
      <h3 className="text-2xl font-semibold mb-3">Educational Details</h3>
      {educationList.map((edu, idx) => (
        <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 border-b pb-3">
          {/* QUALIFICATION */}
          <div>
            <label className="block text-xs mb-1 font-medium">
              {["High School", "Senior Secondary", "Bachelor"][idx] || (idx === 3 ? "Master" : "PhD")}{" "}
              {!edu.optional && <span className="text-red-500">*</span>}
            </label>
            <select
              value={edu.qualification}
              disabled={!isEditing}
              onChange={(e) => handleChange(edu.id, "qualification", e.target.value)}
              className={`w-full border rounded px-3 py-1.5 ${edu.errors?.qualification ? "border-red-500" : "border-gray-300"} ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">Select</option>
              <option value="High School">High School</option>
              <option value="Senior Secondary">Senior Secondary</option>
              <option value="Bachelor of Engineering">Bachelor of Engineering</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* YEAR */}
          <div>
            <label className="block text-xs mb-1 font-medium">
              Year Of Completion {!edu.optional && <span className="text-red-500">*</span>}
            </label>
            <input
              maxLength={4}
              disabled={!isEditing}
              value={edu.year}
              onChange={(e) => handleChange(edu.id, "year", e.target.value)}
              className={`w-full border rounded px-3 py-1.5 ${edu.errors?.year ? "border-red-500" : "border-gray-300"} ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* DOCUMENT */}
          <div>
            <label className="block text-xs mb-1 font-medium">
              Upload Document {!edu.optional && <span className="text-red-500">*</span>}
            </label>
            <div className={`border rounded px-2 py-1.5 flex justify-between items-center ${edu.errors?.document ? "border-red-500" : "border-gray-300"} ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}>
              <span className="text-gray-500 truncate">
                {edu.document instanceof File ? edu.document.name : edu.document ? edu.document.toString().split("/").pop() : "Upload"}
              </span>
              {isEditing && (
                <label>
                  <Upload size={14} className="cursor-pointer text-gray-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleChange(edu.id, "document", e.target.files?.[0] || null)}
                  />
                </label>
              )}
               {edu.document && !isEditing && (
              <a
                href={
                  edu.document instanceof File
                    ? URL.createObjectURL(edu.document) // show local file
                    : edu.document.startsWith("http")
                      ? edu.document
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${edu.document}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-1 block"
              >
                View
              </a>
            )}
            </div>
          </div>
        </div>
      ))}

      {/* BUTTONS */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          disabled={isFirstTimeUser || isEditing}
          onClick={() => setIsEditing(true)}
          className={`px-6 py-2 rounded ${isFirstTimeUser || isEditing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
        >
          Edit
        </button>

        <button
          disabled={!isEditing || isSubmitting}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded ${isEditing ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Save
        </button>

        <button
          disabled={isEditing}
          onClick={handleNext}
          className={`px-6 py-2 rounded ${!isEditing ? "bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Education;