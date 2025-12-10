import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import MouseSignature from "../MouseSignature";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type RegimeOption = "Yes" | "No" | "";
interface AnnualInvestmentProps {
  isActive: boolean;
  onNext?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}
interface FormErrors {
  date?: string;
  residingInRentedHouse?: string;
  landlordName?: string;
  declaration?: string;
}

const AnnualInvestment: React.FC<AnnualInvestmentProps> = ({ isActive, onNext, onValidationChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [userFinanceId, setUserFinanceId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [financialYear, setFinancialYear] = useState("2025-26");
  const [regimeOption, setRegimeOption] = useState<RegimeOption>("");
  const [residingInRentedHouse, setResidingInRentedHouse] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [pensionPlan, setPensionPlan] = useState("");
  const [licPremium, setLicPremium] = useState("");
  const [ppf, setPpf] = useState("");
  const [ulip, setUlip] = useState("");
  const [tuitionFees, setTuitionFees] = useState("");
  const [nsc, setNsc] = useState("");
  const [nscInterest, setNscInterest] = useState("");
  const [housingLoanRepayment, setHousingLoanRepayment] = useState("");
  const [otherInvestments, setOtherInvestments] = useState("");
  const [documents, setDocuments] = useState<(File | string | null)[]>([]);
  const [infraBond, setInfraBond] = useState("");
  const [eduLoan, setEduLoan] = useState("");
  const [nps, setNps] = useState("");
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const employeeName = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const isDisabled = isExistingUser && !isEditing;
  const handleDocumentUpload = (index: number, file: File | null) => {
    if (isDisabled) return;
    if (!file) return;
    setDocuments((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const addNewDocument = () => {
    if (isDisabled) return;
    setDocuments((prev) => [...prev, null]);
  };

  const removeDocument = (index: number) => {
    if (isDisabled) return;
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };
  const fetchFinanceDetails = async () => {
    try {
      const storedUser = localStorage.getItem("userData");
      const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
      if (!userId) return;
      const res = await api.get(`/api/finance/user/${userId}`);
      const data = res.data;
      if (!data || data.length === 0) {
        setIsExistingUser(false);
        setIsFirstTimeUser(true);
        setIsEditing(true);
        setDocuments([]);
        setSignaturePreview(null);
        setSignatureFile(null);
        return;
      }
      const f = data[0];
      setIsExistingUser(true);
      setIsFirstTimeUser(false);
      setIsEditing(false);
      onValidationChange?.(true);
      setUserFinanceId(f.user_finance_id || null);
      setDate(f.date || "");
      setFinancialYear(f.financial_year || "");
      setRegimeOption(f.opting_for_concessional_rate || "");
      setResidingInRentedHouse(f.residing_in_rented_house || "");
      setMonthlyRent(f.monthly_rent ? String(f.monthly_rent) : "");
      setLandlordName(f.landlord_name || "");
      setTempAddress(f.temporary_address || "");
      setPensionPlan(String(f.pension_plan || ""));
      setLicPremium(String(f.lic_premium || ""));
      setPpf(String(f.ppf || ""));
      setUlip(String(f.ulip || ""));
      setTuitionFees(String(f.tuition_fees || ""));
      setNsc(String(f.nsc || ""));
      setNscInterest(String(f.nsc_interest || ""));
      setHousingLoanRepayment(String(f.housing_loan_repayment || ""));
      setOtherInvestments(String(f.other_investments || ""));
      setInfraBond(String(f.infrastructure_bond || ""));
      setEduLoan(String(f.educational_loan_interest || ""));
      setNps(String(f.contribution_to_nps || ""));
      if (Array.isArray(f.upload_document)) {
        const normalized = f.upload_document.map((doc: string) => {
          let url = doc.replace(/\\/g, "/");
          if (url.includes("uploads/employee_family")) {
            url = url.replace("uploads/employee_family", "files/employee_form12");
          }
          if (!url.startsWith("http")) {
            url = `${api.defaults.baseURL}/${url}`;
          }
          return url;
        });
        setDocuments(normalized);
      }
      if (f.declaration_text && f.declaration_text.trim() !== "") {
        setDeclarationChecked(true);
      } else {
        setDeclarationChecked(false);
      }
      if (f.signature_name) {
        let url = f.signature_name.replace(/\\/g, "/");
        if (url.includes("uploads/employee_family")) {
          url = url.replace("uploads/employee_family", "files/employee_form12");
        }
        if (!url.startsWith("http")) {
          url = `${api.defaults.baseURL}/${url}`;
        }
        setSignaturePreview(url);
        try {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error("Signature not found");
          const blob = await resp.blob();
          setSignatureFile(new File([blob], "signature.png", { type: blob.type }));
        } catch (err) {
          console.error("❌ Signature preview load failed", err);
          setSignaturePreview(null);
          setSignatureFile(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchFinanceDetails();
  }, []);

  const validateField = (field: keyof FormErrors, value: any) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      const empty = !value || !String(value).trim();
      if (field === "date") {
        next.date = empty ? "Date is required" : undefined;
      }
      if (field === "residingInRentedHouse") {
        next.residingInRentedHouse = empty ? "Please choose an option" : undefined;
      }
      if (field === "landlordName" && residingInRentedHouse === "Yes") {
        next.landlordName = empty ? "Landlord name is required" : undefined;
      }
      if (field === "declaration") {
        next.declaration = empty ? "You must accept the declaration" : undefined;
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    validateField("date", date);
    validateField("residingInRentedHouse", residingInRentedHouse);
    validateField("landlordName", landlordName);
    validateField("declaration", declarationChecked);
    const hasErrors = Object.values(formErrors).some(Boolean);
    if (hasErrors) return;
    const storedUser = localStorage.getItem("userData");
    const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
    if (!userId) {
      toast.error("User ID missing");
      return;
    }
    const form = new FormData();
    if (userFinanceId) form.append("user_finance_id", userFinanceId);
    form.append("user_id", userId);
    form.append("date", date);
    form.append("financial_year", financialYear);
    form.append("opting_for_concessional_rate", regimeOption);
    form.append("residing_in_rented_house", residingInRentedHouse);
    form.append(
      "monthly_rent",
      monthlyRent.trim() === "" ? "" : monthlyRent
    );
    form.append("landlord_name", landlordName);
    form.append("temporary_address", tempAddress);
    form.append("pension_plan", pensionPlan);
    form.append("lic_premium", licPremium);
    form.append("ppf", ppf);
    form.append("ulip", ulip);
    form.append("tuition_fees", tuitionFees);
    form.append("nsc", nsc);
    form.append("nsc_interest", nscInterest);
    form.append("housing_loan_repayment", housingLoanRepayment);
    form.append("other_investments", otherInvestments);
    form.append("infrastructure_bond", infraBond);
    form.append("educational_loan_interest", eduLoan);
    form.append("contribution_to_nps", nps);
    form.append("status", "Approved");

    if (residingInRentedHouse === "Yes") {
      if (!monthlyRent.trim()) return toast.error("Monthly Rent is required.");
      if (!landlordName.trim()) return toast.error("Landlord Name is required.");
      if (!tempAddress.trim()) return toast.error("Temporary Address is required.");
    }

    const urlToFile = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.split("/").pop()!;
      return new File([blob], filename, { type: blob.type });
    };

    for (const doc of documents) {
      if (!doc) continue;
      if (doc instanceof File) {
        form.append("upload_document", doc);
      } else if (typeof doc === "string") {
        try {
          const file = await urlToFile(doc);
          form.append("upload_document", file);
        } catch (err) {
          form.append("upload_document", doc);
        }
      }
    }
    if (!pensionPlan.trim()) return toast.error("Pension Plan is required.");
    if (!licPremium.trim()) return toast.error("LIC Premium is required.");
    if (!ppf.trim()) return toast.error("PPF is required.");
    if (!ulip.trim()) return toast.error("ULIP is required.");
    if (!tuitionFees.trim()) return toast.error("Tuition Fees is required.");
    if (!nsc.trim()) return toast.error("NSC is required.");
    if (!nscInterest.trim()) return toast.error("NSC Interest is required.");
    if (!housingLoanRepayment.trim()) return toast.error("Housing Loan Repayment is required.");
    if (!otherInvestments.trim()) return toast.error("Other Investments is required.");
    if (!infraBond.trim()) return toast.error("Infrastructure Bond is required.");
    if (!eduLoan.trim()) return toast.error("Educational Loan Interest is required.");
    if (!nps.trim()) return toast.error("Contribution to NPS is required.");
    if (!documents[0]) return toast.error("Upload at least one required document.");
    if (!signatureFile && !signaturePreview)
      return toast.error("Signature is required.");
    form.append(
      "declaration_text",
      declarationChecked
        ? "I hereby declare that what is stated above..."
        : ""
    );
    form.append("signature_name", employeeName);
    if (signatureFile) {
      form.append("signature_file", signatureFile);
    } else if (signaturePreview) {
      const file = await urlToFile(signaturePreview);
      form.append("signature_file", file);
    }
    if (!signatureFile && !signaturePreview)
      return toast.error("Signature is required.");
    try {
      await api.post("/api/finance/crud", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        isExistingUser ? "Updated Successfully!" : "Created Successfully!"
      );
      setIsEditing(false);
      fetchFinanceDetails();
    } catch (err) {
      console.error(err);
      toast.error("Saving failed!");
    }
  };
  const primaryButtonText = isEditMode ? "Send for Approval" : "Send for Approval";

  if (!isActive) return null;
  return (
    <div className="w-full">
      <div className="h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg hide-scrollbar shadow p-4 sm:p-6 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              disabled={isDisabled}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={() => validateField("date", date)}
              className={`w-full border rounded px-2 py-1 ${formErrors.date ? "border-red-500" : "border-gray-300"
                }`}
            />
            {formErrors.date && (
              <p className="text-[11px] text-red-500 mt-1">{formErrors.date}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Financial Year
            </label>
            <select
              disabled={isDisabled}
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="w-full border rounded px-2 py-1 border-gray-300"
            >
              <option value="">Select</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Opting for Concessional Rate (115 BAC)
            </label>
            <select
              disabled={isDisabled}
              value={regimeOption}
              onChange={(e) => setRegimeOption(e.target.value as RegimeOption)}
              className="w-full border rounded px-2 py-1 border-gray-300"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
        <div className="border rounded-md p-3 mb-4">
          <p className="font-semibold text-[12px] mb-2">Rent Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] mb-1 font-medium">
                Residing in Rented House <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isDisabled}
                value={residingInRentedHouse}
                onChange={(e) => setResidingInRentedHouse(e.target.value)}
                onBlur={() =>
                  validateField("residingInRentedHouse", residingInRentedHouse)
                }
                className={`w-full border rounded px-2 py-1 ${formErrors.residingInRentedHouse
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {formErrors.residingInRentedHouse && (
                <p className="text-[11px] text-red-500 mt-1">
                  {formErrors.residingInRentedHouse}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[11px] mb-1 font-medium">
                Monthly Rent (₹)
                {residingInRentedHouse === "Yes" && <span className="text-red-500">*</span>}
              </label>
              <input
                disabled={isDisabled}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full border rounded px-2 py-1 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-[11px] mb-1 font-medium">
                Landlord Name{" "}
                {residingInRentedHouse === "Yes" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                disabled={isDisabled}
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                onBlur={() => validateField("landlordName", landlordName)}
                className={`w-full border rounded px-2 py-1 ${formErrors.landlordName
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {formErrors.landlordName && (
                <p className="text-[11px] text-red-500 mt-1">
                  {formErrors.landlordName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[11px] mb-1 font-medium">
                Temporaty Address
                {residingInRentedHouse === "Yes" && <span className="text-red-500">*</span>}
              </label>
              <textarea
                disabled={isDisabled}
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                className="w-full border rounded px-2 py-1 min-h-[40px] border-gray-300"
              />
            </div>
          </div>
        </div>
        <div className="border rounded-md p-4 mb-4">
          <p className="font-semibold text-[12px] mb-3">
            Investment under Section 80C
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Pension Plan (₹)", state: pensionPlan, set: setPensionPlan },
              { label: "LIC Premium (₹)", state: licPremium, set: setLicPremium },
              { label: "PPF (₹)", state: ppf, set: setPpf },
              { label: "ULIP (₹)", state: ulip, set: setUlip },
              { label: "Tuition Fees for Children (₹)", state: tuitionFees, set: setTuitionFees },
              { label: "NSC (₹)", state: nsc, set: setNsc },
              { label: "NSC Interest (₹)", state: nscInterest, set: setNscInterest },
              { label: "Housing Loan Repayment (₹)", state: housingLoanRepayment, set: setHousingLoanRepayment },
              { label: "Other Investments under 80C (₹)", state: otherInvestments, set: setOtherInvestments },
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-[11px] mb-1 font-medium">
                  {item.label} <span className="text-red-500">*</span>
                </label>

                <input
                  disabled={isDisabled}
                  value={item.state}
                  onChange={(e) => item.set(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border rounded px-2 py-1 text-xs border-gray-300"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-md p-3 mb-4">
          <p className="font-semibold text-[12px] mb-2">Total investment under 80C</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Infrastructure Bond <span className="text-red-500">*</span>
              </label>
              <input
                disabled={isDisabled}
                value={infraBond}
                onChange={(e) => setInfraBond(e.target.value)}
                className="w-full border rounded px-2 py-1 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Educational Loan Interest <span className="text-red-500">*</span>
              </label>
              <input
                disabled={isDisabled}
                value={eduLoan}
                onChange={(e) => setEduLoan(e.target.value)}
                className="w-full border rounded px-2 py-1 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Contribution to NPS Deduction <span className="text-red-500">*</span>
              </label>
              <input
                disabled={isDisabled}
                value={nps}
                onChange={(e) => setNps(e.target.value)}
                className="w-full border rounded px-2 py-1 border-gray-300"
              />
            </div>
          </div><div className="border rounded-md p-4 mb-4">
            <p className="font-semibold text-[12px] mb-2">
              Upload Required Document <span className="text-red-500">*</span>
            </p>
            <div className="flex items-center gap-3">
              <label
                className={`flex items-center w-60 bg-gray-50 border rounded px-2 py-1 cursor-pointer ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Upload size={15} className="text-gray-600 mr-2" />
                <span className="text-xs text-gray-600 truncate">
                  {documents[0]
                    ? documents[0] instanceof File
                      ? documents[0].name
                      : typeof documents[0] === "string"
                        ? documents[0].split("/").pop()
                        : ""
                    : "Upload"}
                </span>
                <input
                  type="file"
                  disabled={isDisabled}
                  className="hidden"
                  onChange={(e) => handleDocumentUpload(0, e.target.files?.[0] || null)}
                />
              </label>
              <button
                disabled={isDisabled}
                onClick={addNewDocument}
                className={`h-8 w-8 flex items-center justify-center bg-blue-600 text-white
       rounded text-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                +
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {documents.map((doc, index) =>
                index === 0 ? null : (
                  <div key={index} className="flex items-center gap-3">
                    <label className="flex items-center w-60 bg-gray-50 border rounded px-2 py-1 cursor-pointer">
                      <Upload size={15} className="text-gray-600 mr-2" />
                      <span className="text-xs text-gray-600 truncate">
                        {doc instanceof File
                          ? doc.name
                          : typeof doc === "string"
                            ? doc.split("/").pop()
                            : "Upload"}
                      </span>
                      <input
                        type="file"
                        disabled={isDisabled}
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(index, e.target.files?.[0] || null)}
                      />
                    </label>
                    <button
                      disabled={isDisabled}
                      onClick={() => removeDocument(index)}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 border-t pt-3">
          <label className="flex items-start gap-2 text-[11px]">
            <input
              disabled={isDisabled}
              type="checkbox"
              checked={declarationChecked}
              onChange={(e) => {
                setDeclarationChecked(e.target.checked);
                validateField("declaration", e.target.checked);
              }}
              className="mt-[3px]"
            />
            <span>
              “I hereby declare that what is stated above is true to the best of my knowledge
              and belief. I hereby undertake to produce the original proof of investment
              mentioned above, made by me, during the current financial year, at any time,
              if demanded by the Company / Income Tax Department. I also undertake to
              indemnify Petronet MHB Ltd. for any loss arising out of acts or omission
              made in respect of the above investment declaration.”
            </span>
          </label>
          {formErrors.declaration && (
            <p className="text-[11px] text-red-500 mt-1">
              {formErrors.declaration}
            </p>
          )}
          <div>
            <MouseSignature
              thumbnailBase64={signaturePreview}
              onSave={(value) => {
                setSignaturePreview(value);
                if (value) {
                  fetch(value)
                    .then(res => res.blob())
                    .then(blob =>
                      setSignatureFile(new File([blob], "signature.png", { type: "image/png" }))
                    );
                } else {
                  setSignatureFile(null);
                }
              }}
            />
            <p className="text-xs text-gray-700 mt-1">{employeeName}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-3 ">
          <button
            disabled={isFirstTimeUser || isEditing}
            onClick={() => setIsEditing(true)}
            className={`px-6 py-2 rounded ${isFirstTimeUser || isEditing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => navigate(`/hr-admin/annual-investment/print/${userFinanceId}`)}
            className="px-4 py-1 border rounded text-gray-700 hover:bg-gray-100"
          >
            Print
          </button>
          <button
            className={`px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 ${submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Send for Approval" : primaryButtonText}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={isEditMode}
            className={`px-6 py-1 rounded-md font-medium ${!isEditMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnualInvestment;