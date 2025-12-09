import React, { use, useEffect, useState } from "react";
import { Trash2, Plus, Upload} from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
interface FamilyProps {
  isActive: boolean;
  onNext?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

interface Parent {
  id: number | null;
  relationship: "Mother" | "Father" | "";
  name: string;
  dob: string;
  document?: File | null;
  documentUrl?: string | null;
}

interface Spouse {
  id: number | null;
  name: string;
  gender: string;
  dob: string;
  date_of_marriage: string;
  document?: File | null;
  documentUrl?: string | null;
}

interface Child {
  id: number | null;
  name: string;
  gender: string;
  dob: string;
  place_of_birth: string;
  document?: File | null;
  documentUrl?: string | null;
}

const Family: React.FC<FamilyProps> = ({ isActive, onNext, onValidationChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [parents, setParents] = useState<Parent[]>([
    { id: null, relationship: "Mother", name: "", dob: "", document: null },
    { id: null, relationship: "Father", name: "", dob: "", document: null },
  ]);
  const [spouse, setSpouse] = useState<Spouse[]>([
    { id: null, name: "", gender: "", dob: "", date_of_marriage: "", document: null },
  ]);
  const [children, setChildren] = useState<Child[]>([
    { id: null, name: "", gender: "", dob: "", place_of_birth: "", document: null },
  ]);
  const isDisabled = isExistingUser && !isEditing;

  const fetchFamilyDetails = async () => {
    try {
      const storedUser = localStorage.getItem("userData");
      const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
      if (!userId) return;
      const res = await api.get(`/api/employee-family/user/${userId}`);
      const data = res.data;

      if (!Array.isArray(data) || data.length === 0) {
        // FIRST TIME USER
        setIsExistingUser(false);
        setIsEditing(true); 
        setIsFirstTimeUser(true); 
        return;
      }

      // Returning user
      setIsExistingUser(true);
      setIsEditing(false);
      setIsFirstTimeUser(false);

      const valid = data.filter((item) =>
        ["father", "mother", "spouse", "child"].includes(
          item.relation?.toLowerCase()
        )
      );

      const parentList = valid.filter((r) =>
        ["father", "mother"].includes(r.relation.toLowerCase())
      );

      const spouseList = valid.filter(
        (r) => r.relation.toLowerCase() === "spouse"
      );

      const childList = valid.filter(
        (r) => r.relation.toLowerCase() === "child"
      );

      const mother = parentList.find((p: any) => p.relation.toLowerCase() === "mother");
      const father = parentList.find((p: any) => p.relation.toLowerCase() === "father");

      setParents([
        {
          id: mother?.ef_id || null,
          relationship: "Mother",
          name: mother?.full_name || "",
          dob: mother?.dob || "",
          document: null,
          documentUrl: mother?.document || null
        },
        {
          id: father?.ef_id || null,
          relationship: "Father",
          name: father?.full_name || "",
          dob: father?.dob || "",
          document: null,
          documentUrl: father?.document || null
        }
      ]);

      setSpouse(
        spouseList.length
          ? spouseList.map((s: any) => ({
            id: s.ef_id,
            name: s.full_name,
            gender: s.gender || "",
            dob: s.dob || "",
            date_of_marriage: s.date_of_marriage || "",
            document: null,
            documentUrl: s.document || null
          }))
          : [{ id: null, name: "", gender: "", dob: "", date_of_marriage: "", document: null }]
      );

      setChildren(
        childList.map((c: any) => ({
          id: c.ef_id,
          name: c.full_name,
          gender: c.gender || "",
          dob: c.dob || "",
          place_of_birth: c.place_of_birth || "",
          document: null,
          documentUrl: c.document || null
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  useEffect(() => {
    if (isActive && onValidationChange) {
      onValidationChange(true); 
    }
  }, [isActive]);

  const handleParentChange = (index: number | null, field: string, value: string | File | null) => {
    setParents(prev =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleSpouseChange = (index: number | null, field: string, value: string | File | null) => {
    setSpouse(prev =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleChildChange = (index: number | null, field: string, value: string | File | null) => {
    setChildren(prev =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addChild = () => {
    if (isDisabled) return;
    setChildren((prev) => [
      ...prev,
      { id: null, name: "", gender: "", dob: "", place_of_birth: "", document: null },
    ]);
  };

  const removeChild = (index: number) => {
    if (isDisabled) return;

    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  const uploadSingleRecord = async (item: any) => {
    const form = new FormData();
    const storedUser = localStorage.getItem("userData");
    const userId = storedUser ? JSON.parse(storedUser)?.userId : null;


    if (!userId || userId === "null" || userId === "undefined") {
      toast("User ID missing. Please login again.");
      return;
    }

    if (item.id) form.append("ef_id", item.id);

    form.append("user_id", userId);
    form.append("relation", item.relation);
    form.append("full_name", item.full_name || "");
    form.append("dob", item.dob || "");
    form.append
    form.append("gender", item.gender || "");
    form.append("place_of_birth", item.place_of_birth || "");
    form.append("date_of_marriage", item.date_of_marriage || "");

    if (item.document) form.append("file", item.document);

    return api.post("/api/employee-family/crud", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
 if (!isActive) return null;
  const handleSubmitAll = async () => {
    const allItems = [
      ...parents.map((p) => ({
        id: p.id,
        relation: p.relationship,
        full_name: p.name,
        dob: p.dob,
        gender: "",               // parents have no gender in your form
        place_of_birth: "",
        date_of_marriage: "",
        document: p.document,
      })),

      ...spouse.map((s) => ({
        id: s.id,
        relation: "Spouse",
        full_name: s.name,
        dob: s.dob,
        gender: s.gender,
        place_of_birth: "",
        date_of_marriage: s.date_of_marriage,
        document: s.document,
      })),

      ...children.map((c) => ({
        id: c.id,
        relation: "Child",
        full_name: c.name,
        dob: c.dob,
        gender: c.gender,
        place_of_birth: c.place_of_birth,
        date_of_marriage: "",
        document: c.document,
      })),
    ];

    try {
      for (const item of allItems) {
        await uploadSingleRecord(item);
      }

      toast(isExistingUser
        ? "Family Info Updated Successfully!"
        : "Family Info Created Successfully!"
      );

      setIsEditing(false);
      fetchFamilyDetails();
    } catch (err) {
      console.error(err);
      toast("Saving failed!");
    }
  };

  return (
    <div className="w-full overflow-x-hidden hide-scrollbar bg-white">
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto pb-20">
        <h1 className="text-base sm:text-xl font-semibold mb-3">
          Family Information
        </h1>
        <section className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Parents Details</h2>
          </div>

          <table className="w-full min-w-[680px] border text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Relationship</th>
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">DOB</th>
                <th className="border px-2 py-1">Document</th>
              </tr>
            </thead>

            <tbody>
              {parents.map((p, index) => (
                <tr key={p.id ?? p.relationship}>
                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={p.relationship}
                      readOnly
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={p.name}
                      onChange={(e) =>
                        handleParentChange(index, "name", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      type="date"
                      value={p.dob}
                      onChange={(e) =>
                        handleParentChange(index, "dob", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <label
                      className={`cursor-pointer flex flex-col items-center ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      <Upload size={16} />

                      <span className="text-[10px]">
                        {p.document
                          ? p.document.name
                          : p.documentUrl
                            ? p.documentUrl.split(/[/\\]/).pop()
                            : "Upload"}
                      </span>
                      <input
                        disabled={isDisabled}
                        type="file"
                        className="hidden "
                        onChange={(e) =>
                          handleParentChange(
                            index,
                            "document",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Spouse Details</h2>
          </div>

          <table className="w-full min-w-[740px] border text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">Gender</th>
                <th className="border px-2 py-1">DOB</th>
                <th className="border px-2 py-1">Marriage Date</th>
                <th className="border px-2 py-1">Document</th>
              </tr>
            </thead>

            <tbody>
              {spouse.map((s, index) => (
                <tr key={s.id ?? "spouse"}>
                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={s.name}
                      onChange={(e) =>
                        handleSpouseChange(index, "name", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <select
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={s.gender}
                      onChange={(e) =>
                        handleSpouseChange(index, "gender", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      type="date"
                      value={s.dob}
                      onChange={(e) =>
                        handleSpouseChange(index, "dob", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      type="date"
                      value={s.date_of_marriage}
                      onChange={(e) =>
                        handleSpouseChange(index, "date_of_marriage", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload size={16} />
                      <span className="text-[10px]">
                        {s.document
                          ? s.document.name
                          : s.documentUrl
                            ? s.documentUrl.split(/[/\\]/).pop()
                            : "Upload"}
                      </span>
                      <input
                        disabled={isDisabled}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleSpouseChange(index, "document", e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </section>
        {/* --------------------------------------------------
            CHILDREN TABLE
        -------------------------------------------------- */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Children Details</h2>

            <div className="flex items-center gap-2">
              <button
                disabled={isDisabled}
                onClick={addChild}
                className={`bg-blue-50 text-blue-600 p-1 rounded ${isDisabled && "opacity-50 cursor-not-allowed"
                  }`}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <table className="w-full min-w-[740px] border text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">Gender</th>
                <th className="border px-2 py-1">DOB</th>
                <th className="border px-2 py-1">Place of Birth</th>
                <th className="border px-2 py-1">Document</th>
                <th className="border px-2 py-1 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {children.map((c, index) => (
                <tr key={c.id ?? `temp-${index}`}>
                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={c.name}
                      onChange={(e) => handleChildChange(index, "name", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <select
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={c.gender}
                      onChange={(e) => handleChildChange(index, "gender", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      type="date"
                      value={c.dob}
                      onChange={(e) => handleChildChange(index, "dob", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      disabled={isDisabled}
                      className="border rounded w-full px-2 py-1"
                      value={c.place_of_birth}
                      onChange={(e) => handleChildChange(index, "place_of_birth", e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <label className={`cursor-pointer flex flex-col items-center ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <Upload size={16} />

                      <span className="text-[10px]">
                        {c.document
                          ? c.document.name
                          : c.documentUrl
                            ? c.documentUrl.split(/[/\\]/).pop()
                            : "Upload"}
                      </span>

                      <input
                        disabled={isDisabled}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleChildChange(index, "document", e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </td>

                  <td className="border px-2 py-1 text-center">
                    <Trash2
                      size={14}
                      className={`cursor-pointer text-red-500 ${isDisabled && "opacity-50 cursor-not-allowed"}`}
                      onClick={() => removeChild(index)}
                    />
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </section>

        {/* --------------------------------------------------
            FOOTER BUTTONS
        -------------------------------------------------- */}
        <div className="sticky bottom-0 bg-white py-2 flex justify-end gap-3 border-t mt-3">

          {/* EDIT BUTTON */}
          <button
            disabled={isFirstTimeUser || isEditing}
            onClick={() => setIsEditing(true)}
            className={`px-6 py-2 rounded ${isFirstTimeUser || isEditing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white"
              }`}
          >
            Edit
          </button>

          {/* SAVE BUTTON */}
          <button
            disabled={!isEditing}
            onClick={handleSubmitAll}
            className={`px-6 py-2 rounded ${isEditing
                ? "bg-blue-600 text-white"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Save
          </button>

          {/* NEXT BUTTON */}
          {onNext && (
            <button
              disabled={isEditing || isFirstTimeUser}
              onClick={onNext}
              className={`px-6 py-2 rounded ${isEditing || isFirstTimeUser
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white"
                }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Family;