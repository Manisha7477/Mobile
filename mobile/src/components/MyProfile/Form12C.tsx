import React, { useEffect, useState } from "react";
import {Upload } from "lucide-react";
import MouseSignature from "../MouseSignature";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
interface IncomeProps {
  isActive: boolean;
  onNext?: () => void;
}

type Doc = File | string | null;

const Form12C: React.FC<IncomeProps> = ({ isActive, onNext }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [financialYear, setFinancialYear] = useState("2025-26");
  const navigate = useNavigate();
  const [formId, setFormId] = useState<number | null>(null);
  const [selfAlv, setSelfAlv] = useState("");
  const [lo1Alv, setLo1Alv] = useState("");
  const [lo2Alv, setLo2Alv] = useState("");
  const [selfMunicipalTax, setSelfMunicipalTax] = useState("");
  const [lo1MunicipalTax, setLo1MunicipalTax] = useState("");
  const [lo2MunicipalTax, setLo2MunicipalTax] = useState("");
  const [selfAnnualValue, setSelfAnnualValue] = useState("");
  const [lo1AnnualValue, setLo1AnnualValue] = useState("");
  const [lo2AnnualValue, setLo2AnnualValue] = useState("");
  const [selfLess30, setSelfLess30] = useState("");
  const [lo1Less30, setLo1Less30] = useState("");
  const [lo2Less30, setLo2Less30] = useState("");
  const [houseTypeSelf, setHouseTypeSelf] = useState("");
  const [houseTypeLo1, setHouseTypeLo1] = useState("");
  const [houseTypeLo2, setHouseTypeLo2] = useState("");
  const [selfInterest, setSelfInterest] = useState("");
  const [lo1Interest, setLo1Interest] = useState("");
  const [lo2Interest, setLo2Interest] = useState("");
  const [selfLoanDate, setSelfLoanDate] = useState("");
  const [lo1LoanDate, setLo1LoanDate] = useState("");
  const [lo2LoanDate, setLo2LoanDate] = useState("");
  const [selfOneFifthInterest, setSelfOneFifthInterest] = useState("");
  const [lo1OneFifthInterest, setLo1OneFifthInterest] = useState("");
  const [lo2OneFifthInterest, setLo2OneFifthInterest] = useState("");
  const [selfNetIncome, setSelfNetIncome] = useState("");
  const [lo1NetIncome, setLo1NetIncome] = useState("");
  const [lo2NetIncome, setLo2NetIncome] = useState("");
  const [selfTdsSelfLease, setSelfTdsSelfLease] = useState("");
  const [lo1TdsSelfLease, setLo1TdsSelfLease] = useState("");
  const [lo2TdsSelfLease, setLo2TdsSelfLease] = useState("");
  const [selfCessSelfLease, setSelfCessSelfLease] = useState("");
  const [lo1CessSelfLease, setLo1CessSelfLease] = useState("");
  const [lo2CessSelfLease, setLo2CessSelfLease] = useState("");
  const [selfCapitalGains, setSelfCapitalGains] = useState("");
  const [lo1CapitalGains, setLo1CapitalGains] = useState("");
  const [lo2CapitalGains, setLo2CapitalGains] = useState("");
  const [selfOtherSources, setSelfOtherSources] = useState("");
  const [lo1OtherSources, setLo1OtherSources] = useState("");
  const [lo2OtherSources, setLo2OtherSources] = useState("");
  const [selfAggregateItems, setSelfAggregateItems] = useState("");
  const [lo1AggregateItems, setLo1AggregateItems] = useState("");
  const [lo2AggregateItems, setLo2AggregateItems] = useState("");
  const [selfTdsOtherIncome, setSelfTdsOtherIncome] = useState("");
  const [lo1TdsOtherIncome, setLo1TdsOtherIncome] = useState("");
  const [lo2TdsOtherIncome, setLo2TdsOtherIncome] = useState("");
  const [selfCessOtherIncome, setSelfCessOtherIncome] = useState("");
  const [lo1CessOtherIncome, setLo1CessOtherIncome] = useState("");
  const [lo2CessOtherIncome, setLo2CessOtherIncome] = useState("");
  const [selfTotalTds, setSelfTotalTds] = useState("");
  const [lo1TotalTds, setLo1TotalTds] = useState("");
  const [lo2TotalTds, setLo2TotalTds] = useState("");
  const [selfTotalCess, setSelfTotalCess] = useState("");
  const [lo1TotalCess, setLo1TotalCess] = useState("");
  const [lo2TotalCess, setLo2TotalCess] = useState("");
  const [declarationPlace, setDeclarationPlace] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const employeeName = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim();
  const userId = storedUser?.userId;
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

  const fetchForm12C = async () => {
    try {
      if (!userId) return;
      const res = await api.get(`/api/form12c/user/${userId}`);
      const data = res.data;
      if (!data || !Array.isArray(data) || data.length === 0) {
        setIsExistingUser(false);
        setIsFirstTimeUser(true);
        setIsEditing(true);
        setDocuments([]);
        setSignatureFile(null);
        setSignaturePreview(null);
        return;
      }
      const f = data[0];
      setIsExistingUser(true);
      setIsFirstTimeUser(false);
      setIsEditing(false);
      setFormId(f.form_id || null);
      setFinancialYear(f.financial_year || "");
      setSelfAlv(f.self_alv || "");
      setLo1Alv(f.lo1_alv || "");
      setLo2Alv(f.lo2_alv || "");
      setSelfMunicipalTax(f.self_municipal_tax || "");
      setLo1MunicipalTax(f.lo1_municipal_tax || "");
      setLo2MunicipalTax(f.lo2_municipal_tax || "");
      setSelfAnnualValue(f.self_annual_value || "");
      setLo1AnnualValue(f.lo1_annual_value || "");
      setLo2AnnualValue(f.lo2_annual_value || "");
      setSelfLess30(f.self_less_30 || "");
      setLo1Less30(f.lo1_less_30 || "");
      setLo2Less30(f.lo2_less_30 || "");
      setHouseTypeSelf(f.house_type_self || "");
      setHouseTypeLo1(f.house_type_lo1 || "");
      setHouseTypeLo2(f.house_type_lo2 || "");
      setSelfInterest(f.self_interest || "");
      setLo1Interest(f.lo1_interest || "");
      setLo2Interest(f.lo2_interest || "");
      setSelfLoanDate(f.self_loan_date || "");
      setLo1LoanDate(f.lo1_loan_date || "");
      setLo2LoanDate(f.lo2_loan_date || "");
      setSelfOneFifthInterest(f.self_one_fifth_interest || "");
      setLo1OneFifthInterest(f.lo1_one_fifth_interest || "");
      setLo2OneFifthInterest(f.lo2_one_fifth_interest || "");
      setSelfNetIncome(f.self_net_income || "");
      setLo1NetIncome(f.lo1_net_income || "");
      setLo2NetIncome(f.lo2_net_income || "");
      setSelfTdsSelfLease(f.self_tds_self_lease || "");
      setLo1TdsSelfLease(f.lo1_tds_self_lease || "");
      setLo2TdsSelfLease(f.lo2_tds_self_lease || "");
      setSelfCessSelfLease(f.self_cess_self_lease || "");
      setLo1CessSelfLease(f.lo1_cess_self_lease || "");
      setLo2CessSelfLease(f.lo2_cess_self_lease || "");
      setSelfCapitalGains(f.self_capital_gains || "");
      setLo1CapitalGains(f.lo1_capital_gains || "");
      setLo2CapitalGains(f.lo2_capital_gains || "");
      setSelfOtherSources(f.self_other_sources || "");
      setLo1OtherSources(f.lo1_other_sources || "");
      setLo2OtherSources(f.lo2_other_sources || "");
      setSelfAggregateItems(f.self_aggregate_items || "");
      setLo1AggregateItems(f.lo1_aggregate_items || "");
      setLo2AggregateItems(f.lo2_aggregate_items || "");
      setSelfTdsOtherIncome(f.self_tds_other_income || "");
      setLo1TdsOtherIncome(f.lo1_tds_other_income || "");
      setLo2TdsOtherIncome(f.lo2_tds_other_income || "");
      setSelfCessOtherIncome(f.self_cess_other_income || "");
      setLo1CessOtherIncome(f.lo1_cess_other_income || "");
      setLo2CessOtherIncome(f.lo2_cess_other_income || "");
      setSelfTotalTds(f.self_total_tds || "");
      setLo1TotalTds(f.lo1_total_tds || "");
      setLo2TotalTds(f.lo2_total_tds || "");
      setSelfTotalCess(f.self_total_cess || "");
      setLo1TotalCess(f.lo1_total_cess || "");
      setLo2TotalCess(f.lo2_total_cess || "");
      setDeclarationPlace(f.declared_place || "");
      setDeclarationDate(f.declared_date || "");
      if (Array.isArray(f.upload_document)) {
        setDocuments(f.upload_document);
      } else if (typeof f.upload_document === "string" && f.upload_document.trim() !== "") {
        const fixed = decodeURIComponent(f.upload_document);
        const docs = fixed
          .split(",")
          .map((d: string) => d.trim())
          .filter((d: string) => d !== "");

        setDocuments(docs);
      } else {
        setDocuments([]);
      }
      if (f.signature) {
        let finalUrl = f.signature;
        if (!f.signature.startsWith("http")) {
          finalUrl = `${api.defaults.baseURL}/${f.signature.replace(/\\/g, "/")}`;
        }
        setSignaturePreview(finalUrl);
        try {
          const resp = await fetch(finalUrl);
          if (!resp.ok) throw new Error("Fetch failed");
          const blob = await resp.blob();
          const file = new File([blob], "signature.png", { type: blob.type });
          setSignatureFile(file);
        } catch (err) {
          console.error("❌ Failed to load signature:", err);
          setSignaturePreview(null);
          setSignatureFile(null);
        }
      }
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Form12C data");
    }
  };

  useEffect(() => {
    fetchForm12C();
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!declarationPlace || !String(declarationPlace).trim()) {
      next.declarationPlace = "Place is required";
    }
    if (!declarationDate) {
      next.declarationDate = "Date is required";
    }
    if (!documents || documents.length === 0 || !documents[0]) {
      next.documents = "Upload at least one document";
    }
    if (!signatureFile && !signaturePreview) {
      next.signature = "Signature is required";
    }
    if (!financialYear || financialYear.trim() === "") {
      next.financialYear = "Financial Year is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };


  const handleSubmit = async () => {
    if (!validate()) return;
    if (!userId) return toast.error("User ID missing");
    const form = new FormData();
    if (formId) form.append("form_id", String(formId));
    form.append("user_id", String(userId));
    form.append("self_alv", selfAlv);
    form.append("lo1_alv", lo1Alv);
    form.append("lo2_alv", lo2Alv);
    form.append("self_municipal_tax", selfMunicipalTax);
    form.append("lo1_municipal_tax", lo1MunicipalTax);
    form.append("lo2_municipal_tax", lo2MunicipalTax);
    form.append("self_annual_value", selfAnnualValue);
    form.append("lo1_annual_value", lo1AnnualValue);
    form.append("lo2_annual_value", lo2AnnualValue);
    form.append("self_less_30", selfLess30);
    form.append("lo1_less_30", lo1Less30);
    form.append("lo2_less_30", lo2Less30);
    form.append("house_type_self", houseTypeSelf);
    form.append("house_type_lo1", houseTypeLo1);
    form.append("house_type_lo2", houseTypeLo2);
    form.append("self_interest", selfInterest);
    form.append("lo1_interest", lo1Interest);
    form.append("lo2_interest", lo2Interest);
    form.append("self_loan_date", selfLoanDate);
    form.append("lo1_loan_date", lo1LoanDate);
    form.append("lo2_loan_date", lo2LoanDate);
    form.append("self_one_fifth_interest", selfOneFifthInterest);
    form.append("lo1_one_fifth_interest", lo1OneFifthInterest);
    form.append("lo2_one_fifth_interest", lo2OneFifthInterest);
    form.append("self_net_income", selfNetIncome);
    form.append("lo1_net_income", lo1NetIncome);
    form.append("lo2_net_income", lo2NetIncome);
    form.append("self_tds_self_lease", selfTdsSelfLease);
    form.append("lo1_tds_self_lease", lo1TdsSelfLease);
    form.append("lo2_tds_self_lease", lo2TdsSelfLease);
    form.append("self_cess_self_lease", selfCessSelfLease);
    form.append("lo1_cess_self_lease", lo1CessSelfLease);
    form.append("lo2_cess_self_lease", lo2CessSelfLease);
    form.append("self_capital_gains", selfCapitalGains);
    form.append("lo1_capital_gains", lo1CapitalGains);
    form.append("lo2_capital_gains", lo2CapitalGains);
    form.append("self_other_sources", selfOtherSources);
    form.append("lo1_other_sources", lo1OtherSources);
    form.append("lo2_other_sources", lo2OtherSources);
    form.append("self_aggregate_items", selfAggregateItems);
    form.append("lo1_aggregate_items", lo1AggregateItems);
    form.append("lo2_aggregate_items", lo2AggregateItems);
    form.append("self_tds_other_income", selfTdsOtherIncome);
    form.append("lo1_tds_other_income", lo1TdsOtherIncome);
    form.append("lo2_tds_other_income", lo2TdsOtherIncome);
    form.append("self_cess_other_income", selfCessOtherIncome);
    form.append("lo1_cess_other_income", lo1CessOtherIncome);
    form.append("lo2_cess_other_income", lo2CessOtherIncome);
    form.append("self_total_tds", selfTotalTds);
    form.append("lo1_total_tds", lo1TotalTds);
    form.append("lo2_total_tds", lo2TotalTds);
    form.append("self_total_cess", selfTotalCess);
    form.append("lo1_total_cess", lo1TotalCess);
    form.append("lo2_total_cess", lo2TotalCess);
    form.append("financial_year", financialYear || "");
    form.append("declared_place", declarationPlace);
    form.append("declared_date", declarationDate);
    form.append("status", "Approve");
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
    if (signatureFile) {
      form.append("signature_file", signatureFile);
    } else if (signaturePreview && !signatureFile) {
      const file = await urlToFile(signaturePreview);
      form.append("signature_file", file);
    }
    if (!signatureFile && !signaturePreview)
      return toast.error("Signature is required.");
    if (signatureFile) form.append("signature_file", signatureFile);
    form.append("signature_name", employeeName || "");
    if (signatureFile) form.append("signature_file", signatureFile);
    try {
      await api.post("/api/form12c/crud", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(isExistingUser ? "Updated successfully" : "Saved successfully");
      setIsEditing(false);
      fetchForm12C();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };
if (!isActive) return null;
  return (
    <div className="w-full">
      <div className="h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg hide-scrollbar shadow p-4 sm:p-6 text-xs sm:text-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Form 12 C</h3>
            <p className="text-xs text-gray-500">Income from House Property</p>
          </div>
        </div>
        {/* Table section */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 border-b px-4 py-2 text-sm font-semibold">Details of Income from House Property</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border px-3 py-2 text-left w-2/5">Particulars</th>
                  <th className="border px-3 py-2 text-center">Self Occupied</th>
                  <th className="border px-3 py-2 text-center">Let Out (House 1)</th>
                  <th className="border px-3 py-2 text-center">Let Out (House 2)</th>
                </tr>
              </thead>
              <tbody>
                {/* main rows */}
                {[
                  { label: "(a) Annual lettable value / Actual Rent received or receivable whichever is higher (*) for let out properties kept vacant, lettable value or actual rent received or receivable is due to vacancy, the rent received or receivable", self: selfAlv, lo1: lo1Alv, lo2: lo2Alv, setSelf: setSelfAlv, setLo1: setLo1Alv, setLo2: setLo2Alv },
                  { label: "(b) Less: Municipal Taxes paid (Copy to be attached)", self: selfMunicipalTax, lo1: lo1MunicipalTax, lo2: lo2MunicipalTax, setSelf: setSelfMunicipalTax, setLo1: setLo1MunicipalTax, setLo2: setLo2MunicipalTax },
                  { label: "Annual Value (a-b)", self: selfAnnualValue, lo1: lo1AnnualValue, lo2: lo2AnnualValue, setSelf: setSelfAnnualValue, setLo1: setLo1AnnualValue, setLo2: setLo2AnnualValue },
                  { label: "Less: 30% of Annual value (Repairs etc.)", self: selfLess30, lo1: lo1Less30, lo2: lo2Less30, setSelf: setSelfLess30, setLo1: setLo1Less30, setLo2: setLo2Less30 },
                ].map((r, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-3 py-2 align-top text-gray-800">{r.label}</td>
                    <td className="border px-2 py-1 text-center">
                      <input disabled={isDisabled} value={r.self} onChange={(e) => r.setSelf(e.target.value)} className={`w-full border rounded px-2 py-1 text-right ${isDisabled ? "bg-gray-100" : "bg-white"}`} placeholder="Rs. NIL" />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <input disabled={isDisabled} value={r.lo1} onChange={(e) => r.setLo1(e.target.value)} className={`w-full border rounded px-2 py-1 text-right ${isDisabled ? "bg-gray-100" : "bg-white"}`} placeholder="Rs. NIL" />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <input disabled={isDisabled} value={r.lo2} onChange={(e) => r.setLo2(e.target.value)} className={`w-full border rounded px-2 py-1 text-right ${isDisabled ? "bg-gray-100" : "bg-white"}`} placeholder="Rs. NIL" />
                    </td>
                  </tr>
                ))}
                {/* Select House Type */}
                <tr className="bg-white">
                  <td className="border px-3 py-2 text-gray-800">Select House Type (Self occupied / Let Out-1 / Let Out-2) to identify the housing loan taken from Banks</td>
                  <td className="border px-2 py-1 text-center">
                    <select disabled={isDisabled} value={houseTypeSelf} onChange={(e) => setHouseTypeSelf(e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">Select</option>
                      <option value="SO">Self Occupied</option>
                      <option value="LO1">Let Out 1</option>
                      <option value="LO2">Let Out 2</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <select disabled={isDisabled} value={houseTypeLo1} onChange={(e) => setHouseTypeLo1(e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">Select</option>
                      <option value="SO">Self Occupied</option>
                      <option value="LO1">Let Out 1</option>
                      <option value="LO2">Let Out 2</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <select disabled={isDisabled} value={houseTypeLo2} onChange={(e) => setHouseTypeLo2(e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">Select</option>
                      <option value="SO">Self Occupied</option>
                      <option value="LO1">Let Out 1</option>
                      <option value="LO2">Let Out 2</option>
                    </select>
                  </td>
                </tr>
                {/* Loan / other rows (many) */}
                {[
                  { key: "row5", label: "Less: Interest on borrowed capital (Banks)", self: selfInterest, lo1: lo1Interest, lo2: lo2Interest, setSelf: setSelfInterest, setLo1: setLo1Interest, setLo2: setLo2Interest },
                  { key: "row6", label: "Loan Date", isDate: true, self: selfLoanDate, lo1: lo1LoanDate, lo2: lo2LoanDate, setSelf: setSelfLoanDate, setLo1: setLo1LoanDate, setLo2: setLo2LoanDate },
                  { key: "row7", label: "Less: 1/5th of interest paid before construction", self: selfOneFifthInterest, lo1: lo1OneFifthInterest, lo2: lo2OneFifthInterest, setSelf: setSelfOneFifthInterest, setLo1: setLo1OneFifthInterest, setLo2: setLo2OneFifthInterest },
                  { key: "row8", label: "Net Income / (Loss)", self: selfNetIncome, lo1: lo1NetIncome, lo2: lo2NetIncome, setSelf: setSelfNetIncome, setLo1: setLo1NetIncome, setLo2: setLo2NetIncome },
                  { key: "row9", label: "Tax deducted at source on self lease", self: selfTdsSelfLease, lo1: lo1TdsSelfLease, lo2: lo2TdsSelfLease, setSelf: setSelfTdsSelfLease, setLo1: setLo1TdsSelfLease, setLo2: setLo2TdsSelfLease },
                  { key: "row10", label: "CESS on self lease", self: selfCessSelfLease, lo1: lo1CessSelfLease, lo2: lo2CessSelfLease, setSelf: setSelfCessSelfLease, setLo1: setLo1CessSelfLease, setLo2: setLo2CessSelfLease },
                  { key: "row11", label: "Capital Gains (No Loss)", self: selfCapitalGains, lo1: lo1CapitalGains, lo2: lo2CapitalGains, setSelf: setSelfCapitalGains, setLo1: setLo1CapitalGains, setLo2: setLo2CapitalGains },
                  { key: "row12", label: "Other sources (No Loss) interest / others", self: selfOtherSources, lo1: lo1OtherSources, lo2: lo2OtherSources, setSelf: setSelfOtherSources, setLo1: setLo1OtherSources, setLo2: setLo2OtherSources },
                  { key: "row13", label: "Aggregate of items (i) to (iv)", self: selfAggregateItems, lo1: lo1AggregateItems, lo2: lo2AggregateItems, setSelf: setSelfAggregateItems, setLo1: setLo1AggregateItems, setLo2: setLo2AggregateItems },
                  { key: "row14", label: "TDS on other income", self: selfTdsOtherIncome, lo1: lo1TdsOtherIncome, lo2: lo2TdsOtherIncome, setSelf: setSelfTdsOtherIncome, setLo1: setLo1TdsOtherIncome, setLo2: setLo2TdsOtherIncome },
                  { key: "row15", label: "CESS on other income", self: selfCessOtherIncome, lo1: lo1CessOtherIncome, lo2: lo2CessOtherIncome, setSelf: setSelfCessOtherIncome, setLo1: setLo1CessOtherIncome, setLo2: setLo2CessOtherIncome },
                  { key: "row16", label: "Total TDS (a+c)", self: selfTotalTds, lo1: lo1TotalTds, lo2: lo2TotalTds, setSelf: setSelfTotalTds, setLo1: setLo1TotalTds, setLo2: setLo2TotalTds },
                  { key: "row17", label: "Total CESS (b+d)", self: selfTotalCess, lo1: lo1TotalCess, lo2: lo2TotalCess, setSelf: setSelfTotalCess, setLo1: setLo1TotalCess, setLo2: setLo2TotalCess },
                ].map((r) => (
                  <tr key={r.key} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-3 py-2 text-gray-800">{r.label}</td>
                    <td className="border px-2 py-1 text-center">
                      {r.isDate ? (
                        <input type="date" disabled={isDisabled} value={r.self} onChange={(e) => r.setSelf(e.target.value)} className="w-full border rounded px-2 py-1" />
                      ) : (
                        <input disabled={isDisabled} value={r.self} onChange={(e) => r.setSelf(e.target.value)} className="w-full border rounded px-2 py-1 text-right" />
                      )}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {r.isDate ? (
                        <input type="date" disabled={isDisabled} value={r.lo1} onChange={(e) => r.setLo1(e.target.value)} className="w-full border rounded px-2 py-1" />
                      ) : (
                        <input disabled={isDisabled} value={r.lo1} onChange={(e) => r.setLo1(e.target.value)} className="w-full border rounded px-2 py-1 text-right" />
                      )}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {r.isDate ? (
                        <input type="date" disabled={isDisabled} value={r.lo2} onChange={(e) => r.setLo2(e.target.value)} className="w-full border rounded px-2 py-1" />
                      ) : (
                        <input disabled={isDisabled} value={r.lo2} onChange={(e) => r.setLo2(e.target.value)} className="w-full border rounded px-2 py-1 text-right" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Documents upload */}
        <div className="border rounded-md p-4 mb-4">
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
            {/* Add new file button */}
            <button
              disabled={isDisabled}
              onClick={addNewDocument}
              className={`h-8 w-8 flex items-center justify-center bg-blue-600 text-white
              rounded text-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              +
            </button>
          </div>
          {/* Additional documents */}
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
        {/* Declaration + Signature */}
        <div className="mb-6">
          <label className="flex items-start gap-2 text-[11px]">
            <input type="checkbox" disabled={isDisabled} checked={!!declarationPlace} onChange={(e) => setDeclarationPlace(e.target.checked ? declarationPlace : declarationPlace)} className="mt-[3px] hidden" />
            <span>
              I hereby declare that the information given above is true, complete and correct to
              the best of my knowledge and belief. I further declare that I shall submit the
              relevant proofs/documents for the investments and payments declared above as and
              when required by the company. I understand that any false declaration or
              withholding of information may result in disciplinary action.
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-[11px] mb-1">Place <span className="text-red-500">*</span></label>
              <input disabled={isDisabled} value={declarationPlace} onChange={(e) => setDeclarationPlace(e.target.value)} className={`w-full border rounded px-2 py-1 ${errors.declarationPlace ? "border-red-500" : "border-gray-300"}`} />
              {errors.declarationPlace && <p className="text-[11px] text-red-500 mt-1">{errors.declarationPlace}</p>}
            </div>
            <div>
              <label className="block text-[11px] mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" disabled={isDisabled} value={declarationDate} onChange={(e) => setDeclarationDate(e.target.value)} className={`w-full border rounded px-2 py-1 ${errors.declarationDate ? "border-red-500" : "border-gray-300"}`} />
              {errors.declarationDate && <p className="text-[11px] text-red-500 mt-1">{errors.declarationDate}</p>}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
              {/* Signature Box */}
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
              <div className="mt-3 sm:mt-0">
                <label className="block text-[11px] font-medium mb-1">
                  Financial Year <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={isDisabled}
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className={`w-full border rounded px-2 py-1 ${errors.financialYear ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
                {errors.financialYear && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.financialYear}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white py-2 flex justify-end gap-3 border-t mt-3">
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
           <button
            type="button"
            onClick={() => navigate(`/hr-admin/12-c/print/${formId}`)}
            className="px-4 py-1 border rounded text-gray-700 hover:bg-gray-100"
          >
            Print
          </button>
          <button disabled={!isEditing} onClick={handleSubmit} className={`px-6 py-2 rounded ${isEditing ? "bg-blue-600 text-white" : "bg-gray-400 cursor-not-allowed"}`}>Send for Approval</button>
          <button
            type="button"
            onClick={() =>
              navigate(`/profile`)
            }
            disabled={isEditing}
            className={`px-6 py-1 rounded-md font-medium ${!isEditing
              ? "bg-blue-600 text-white"
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

export default Form12C;