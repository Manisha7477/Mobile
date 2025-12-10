import React, { useEffect, useState, useCallback} from "react";
import { ChevronDown, Upload, X } from "lucide-react";
import MouseSignature from "../MouseSignature";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import AssetTable, { AssetRow } from "../tables/AssetTable";
import { useNavigate } from "react-router-dom";
interface AssetDeclarationData extends AssetRow {
    asset_id: string;
    user_id: number;
    date: string;
    financial_year: string;
    document?: string; 
    signature?: string; 
}
interface AssetDeclarationProps {
    isActive?: boolean;
    onNext?: () => void;
    profileData?: any | null;
    onValidationChange: (isValid: boolean) => void;
}

const AssetDeclaration: React.FC<AssetDeclarationProps> = ({
    isActive = true,
    onNext,
    onValidationChange,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
    const [financialYear, setFinancialYear] = useState("2025-26");
    const [dateValue, setDateValue] = useState<string>("");
    const [immovableRows, setImmovableRows] = useState<AssetRow[]>([{} as AssetRow]);
    const [movableRows, setMovableRows] = useState<AssetRow[]>([{} as AssetRow]);
    const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
    const [existingSignatureUrl, setExistingSignatureUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const [allDeclarations, setAllDeclarations] = useState<AssetDeclarationData[]>([]);
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.userId ?? parsedUser?.user_id ?? null;

    const loadDeclarationForYear = useCallback((year: string, declarations: AssetDeclarationData[]) => {
        setIsLoading(true);
        const filteredAssets = declarations.filter(
            (asset) => asset.financial_year === year
        );
        const cleanImmovable: AssetRow[] = [{} as AssetRow];
        const cleanMovable: AssetRow[] = [{} as AssetRow];
        const cleanDate = new Date().toISOString().slice(0, 10);
        let immRowsToSet = cleanImmovable;
        let movRowsToSet = cleanMovable;
        let dateToSet = cleanDate;
        let documentUrlToSet: string | null = null;
        let signatureUrlToSet: string | null = null;
        let isEditToSet = false;
        if (filteredAssets && filteredAssets.length > 0) {
            const imm: AssetRow[] = filteredAssets.filter(a => a.asset_type === 'Immovable Property');
            const mov: AssetRow[] = filteredAssets.filter(a => a.asset_type === 'Movable Property');
            const firstAsset = filteredAssets[0];
            isEditToSet = true;
            immRowsToSet = imm.length > 0 ? imm : cleanImmovable;
            movRowsToSet = mov.length > 0 ? mov : cleanMovable;
            dateToSet = firstAsset.date || cleanDate;
            if (Array.isArray(firstAsset.document) && firstAsset.document.length > 0) {
                documentUrlToSet = firstAsset.document[0];   // pick first file
            } else {
                documentUrlToSet = null;
            }
            signatureUrlToSet = firstAsset.signature || null;
        }
        if (filteredAssets.length > 0) {
            setIsFirstTimeUser(false);
            setIsEditing(false);
        } else {
            setIsFirstTimeUser(true);
            setIsEditing(true);
        }
        setDateValue(dateToSet);
        setImmovableRows(immRowsToSet);
        setMovableRows(movRowsToSet);
        setExistingDocumentUrl(documentUrlToSet);
        setExistingSignatureUrl(signatureUrlToSet);
        setSignatureBase64(null);
        setSelectedFile(null);
        setIsLoading(false);
    }, []);
    const handleImmovableRowsChange = (newRows: AssetRow[]) => {
        setImmovableRows(newRows);
    };
    const handleMovableRowsChange = (newRows: AssetRow[]) => {
        setMovableRows(newRows);
    };
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateValue(e.target.value);
    };
    const validateSection = useCallback(() => {
        const hasValidImmovable = immovableRows.some((r) => r.details && r.finance_amount !== undefined && r.details.trim() !== '');
        const hasValidMovable = movableRows.some((r) => r.details && r.finance_amount !== undefined && r.details.trim() !== '');
        const hasSignature = !!signatureBase64 || !!existingSignatureUrl;
        const isValid = (hasValidImmovable || hasValidMovable) && hasSignature;
        return isValid;
    }, [immovableRows, movableRows, signatureBase64, existingSignatureUrl]);

    useEffect(() => {
        onValidationChange?.(validateSection());
    }, [validateSection]);

    const fetchAssetDeclaration = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const endpoint = `/api/asset-declaration/user/${userId}`;
        try {
            const res = await api.get<AssetDeclarationData[]>(endpoint);
            const assets: AssetDeclarationData[] = res.data;
            setAllDeclarations(assets);
            let initialYear = "2025-26";
            if (assets.length > 0) {
                const latestAsset = assets.reduce((prev, current) =>
                    (new Date(prev.date).getTime() > new Date(current.date).getTime()) ? prev : current
                );
                initialYear = latestAsset.financial_year;
            }
            setFinancialYear(initialYear);
            loadDeclarationForYear(initialYear, assets);

        } catch (error) {
            toast.error("Failed to load previous asset declaration data, starting a new entry.");
            console.error("Fetch Asset Error:", error);
            setFinancialYear("2025-26");
            loadDeclarationForYear("2025-26", []);
        } finally {
            setIsLoading(false);
        }
    }, [userId, loadDeclarationForYear]);
    useEffect(() => {
        fetchAssetDeclaration();
    }, [fetchAssetDeclaration]);

    const handleFYChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFinancialYear(e.target.value);
    };

    useEffect(() => {
        if (!dateValue) {
            setDateValue(new Date().toISOString().slice(0, 10));
        }
    }, [dateValue]);

    if (!isActive) return null;
    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading asset declaration data...</div>;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        const allowed = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];
        if (!allowed.includes(file.type)) {
            toast.error("Only JPG, PNG, and PDF formats are allowed.");
            return;
        }
        setSelectedFile(file);
        setExistingDocumentUrl(null); 
    };

    const clearFile = () => {
        setSelectedFile(null);
        setExistingDocumentUrl(null); 
    }
    const base64ToFile = (dataurl: string, id: string | number | null) => {
        if (!id) return null;
        const arr = dataurl.split(",");
        if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const uniqueName = `signature_${id}_${Date.now()}.png`;
        return new File([u8arr], uniqueName, { type: mime });
    };
    const toFormData = (obj: Record<string, any>) => {
        const fd = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                fd.append(key, "");
                return;
            }
            if (value instanceof File) {
                fd.append(key, value, value.name);
                return;
            }
            fd.append(key, String(value));
        });
        return fd;
    };

    const handleSubmitAll = async () => {
        if (!userId) {
            toast.error("User not found. Please login.");
            return;
        }
        const immRows = immovableRows.filter((r) => r.details && r.details.trim() !== '');
        const movRows = movableRows.filter((r) => r.details && r.details.trim() !== '');
        if (immRows.length === 0 && movRows.length === 0) {
            toast.error("Please add at least one asset with details.");
            return;
        }
        if (!signatureBase64 && !existingSignatureUrl) {
            toast.error("Signature is required for declaration submission.");
            return;
        }
        setSubmitting(true);
        try {
            let signatureFile: File | null = null;
            let signatureToKeep = false;
            if (signatureBase64) {
                signatureFile = base64ToFile(signatureBase64, userId);
            } else if (existingSignatureUrl) {
                signatureToKeep = true;
            }
            const requests: Promise<any>[] = [];
            const processRow = (row: AssetRow, typeLabel: string) => {
                const assetIdString = row?.asset_id ? String(row.asset_id) : "";
                const payload: Record<string, any> = {
                    user_id: userId,
                    date: dateValue,
                    financial_year: financialYear, 
                    asset_type: typeLabel,
                    details: row?.details ?? "",
                    held_in_name: row?.held_in_name ?? "",
                    acquisition_date: row?.acquisition_date ?? "",
                    nature: row?.nature ?? "",
                    party: row?.party ?? "",
                    finance_amount: row?.finance_amount ?? 0,
                    source_of_finance: row?.source_of_finance ?? "",
                    profit_amount: row?.profit_amount ?? 0,
                    asset_id: assetIdString,
                    status: isEditMode ? "Approved" : "Pending Approval",
                };
                if (selectedFile) {
                    payload.document = selectedFile;
                } else if (isEditMode && existingDocumentUrl) {
                    payload.keep_existing_document = "true";
                }
                if (signatureFile) {
                    payload.signature = signatureFile;
                } else if (signatureToKeep) {
                    payload.keep_existing_signature = "true";
                }
                const fd = toFormData(payload);
                return api.post("/api/asset-declaration/curd", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            };
            immRows.forEach(row => {
                requests.push(processRow(row, 'Immovable Property'));
            });
            movRows.forEach(row => {
                requests.push(processRow(row, 'Movable Property'));
            });
            await Promise.all(requests);
            toast.success(isEditMode ? "Asset Declaration updated successfully!" : "Asset Declaration submitted successfully!");
            await fetchAssetDeclaration();
            onNext?.();

        } catch (err) {
            console.error(err);
            toast.error("Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const primaryButtonText = isEditMode ? "Send for Approval" : "Send for Approval";

    return (
        <div>
            <div
                className="h-[calc(100vh-80px)] overflow-y-auto pr-2 pb-20 "
            >
                <div className="flex items-center gap-2 ">
                    <div className="w-1 h-5 bg-[#FACC15] rounded-sm" />
                    <h2 className="text-[16px] font-semibold text-gray-800">
                        Asset Declaration
                    </h2>
                </div>
                <div className="border-b mt-2" />
                <div className="flex items-start gap-6 mt-2 ">
                    <div className="flex flex-col w-64">
                        <label className="text-sm font-medium mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="border rounded px-4 py-1"
                            value={dateValue}
                            onChange={handleDateChange}
                            disabled={!isEditing}  
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1 block">
                            Financial Year
                        </label>
                        <div className="relative w-52 flex items-center gap-2">
                            <select
                                value={financialYear}
                                onChange={handleFYChange}
                                disabled={!isEditing}
                                className="appearance-none w-full border rounded px-4 py-1 bg-white"
                            >
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                                <option value="2021-22">2021-22</option>
                                <option value="2020-21">2020-21</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <AssetTable title="Immovable Property" rows={immovableRows} readOnly={!isEditing} onRowsChange={handleImmovableRowsChange} />
                <AssetTable title="Movable Property" rows={movableRows} readOnly={!isEditing} onRowsChange={handleMovableRowsChange} />
                <div className="mt-10">
                    <label className="font-medium text-sm">
                        Upload Required Document <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                            </div>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileChange}
                                disabled={!isEditing}
                                className="hidden"
                            />
                        </label>
                        {(selectedFile || existingDocumentUrl) && (
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                                <span className="text-sm">
                                    {selectedFile
                                        ? selectedFile.name
                                        : typeof existingDocumentUrl === 'string'
                                            ? existingDocumentUrl.split('/').pop()
                                            : ''}
                                </span>
                                <X className="w-4 h-4 cursor-pointer text-red-500" onClick={clearFile} />
                            </div>
                        )}
                        {typeof existingDocumentUrl === 'string' && !selectedFile && (
                            <p className="text-xs text-gray-500 ml-3">
                                *Existing document loaded: <a href={existingDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a>. Upload a new file to replace it.
                            </p>
                        )}

                    </div>
                </div>
                <div className="mt-8">
                    <MouseSignature
                        thumbnailBase64={signatureBase64 || existingSignatureUrl || null}
                        onSave={(b64) => {
                            setSignatureBase64(b64);
                            setExistingSignatureUrl(null);
                        }} />
                    {existingSignatureUrl && !signatureBase64 && (
                        <p className="mt-1 text-sm text-gray-700">
                            Existing Signature Found. Draw above to update it.
                            (<a href={existingSignatureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Existing</a>)
                        </p>
                    )}
                    <p className="mt-1 text-sm text-gray-700">{parsedUser?.firstName ?? ""}</p>
                </div>
                <div className="flex justify-end mt-4 gap-3 ">
                    <button
                        disabled={isEditing}
                        onClick={() => setIsEditing(true)}
                        className={`px-6 py-2 rounded ${isEditing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
                            }`}
                    >
                        Edit
                    </button>
                          <button
                        onClick={() =>
                                 
                            navigate(`/hr-admin/asset-declaration/print/${userId}`)
                        }
                        className="px-4 py-1 border rounded text-gray-700 hover:bg-gray-100"
                    >
                        Print
                    </button>
                    <button
                        className={`px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 ${submitting || !validateSection() ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        onClick={handleSubmitAll}
                        disabled={submitting || !validateSection()}
                    >
                        {submitting ? "Send for Approval" : primaryButtonText}
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        className="px-6 py-1 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetDeclaration;