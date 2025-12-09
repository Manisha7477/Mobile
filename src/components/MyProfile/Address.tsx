import React, { useEffect, useState, useCallback } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import api from '@/api/axiosInstance';

interface AddressProps {
  isActive: boolean;
  onNext?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

type MaybeFileOrUrl = File | string | null;

interface AddressData {
  currentAddress: string;
  permanentAddress: string;
  currentAddressProof: MaybeFileOrUrl;
  permanentAddressProof: MaybeFileOrUrl;
}

interface ValidationErrors {
  currentAddress?: string;
  permanentAddress?: string;
  currentAddressProof?: string;
  permanentAddressProof?: string;
}

const Address: React.FC<AddressProps> = ({ isActive, onNext, onValidationChange }) => {
  const [addressData, setAddressData] = useState<AddressData>({
    currentAddress: '',
    permanentAddress: '',
    currentAddressProof: null,
    permanentAddressProof: null
  });

  const [proofNames, setProofNames] = useState<{ current?: string | null; permanent?: string | null }>({
    current: null,
    permanent: null
  });

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.userId;

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filenameFrom = (val: string | null | undefined) => {
    if (!val) return null;
    try {
      const url = new URL(val, window.location.origin);
      return decodeURIComponent(url.pathname.split('/').pop() || val);
    } catch {
      return val;
    }
  };

  const fetchAddressData = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/api/usersProfile/${userId}`);
      const data = response.data;
      const payload = data?.data || data || {};
      const currentAddress = payload.currentAddress ?? payload.current_address ?? '';
      const permanentAddress = payload.permanentAddress ?? payload.permanent_address ?? '';
      const currentProofFromResp =
        payload.currentAddressProof ??
        payload.current_address_proof ??
        payload.currentAddressProofUrl ??
        payload.current_address_proof_url ??
        payload.current_proof ??
        null;
      const permanentProofFromResp =
        payload.permanentAddressProof ??
        payload.permanent_address_proof ??
        payload.permanentAddressProofUrl ??
        payload.permanent_address_proof_url ??
        payload.permanent_proof ??
        null;
      if (currentAddress || permanentAddress) {
        setIsFirstTime(false);
        setEditMode(false);
        setAddressData({
          currentAddress,
          permanentAddress,
          currentAddressProof: currentProofFromResp || null,
          permanentAddressProof: permanentProofFromResp || null
        });
        setProofNames({
          current: filenameFrom(currentProofFromResp),
          permanent: filenameFrom(permanentProofFromResp)
        });
      } else {
        setIsFirstTime(true);
        setEditMode(false);
      }
    } catch (err) {
      console.error('GET error:', err);
      setIsFirstTime(true);
      setEditMode(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isActive || !userId) return;
    fetchAddressData();
  }, [isActive, userId, fetchAddressData]);

  if (!isActive) return null;

  const validateAddress = (address: string): string | undefined => {
    if (!address || !address.trim()) return 'Address is required';
    if (address.trim().length < 5) return 'Address must be at least 5 characters';
    if (address.trim().length > 300) return 'Address must not exceed 300 characters';
    return undefined;
  };

  const validateFileConditional = (value: MaybeFileOrUrl, fieldName: string): string | undefined => {
    if (!value) return `${fieldName} is required`;
    if (typeof value === 'string') return undefined;
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(value.type)) {
      return `${fieldName} must be PDF, JPG, PNG, or DOC`;
    }
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (value.size > maxSize) {
      return `${fieldName} must be less than 5MB`;
    }
    return undefined;
  };

  const isViewMode = !isFirstTime && !editMode;

  const validateForm = (data: AddressData) => {
    const newErrors: ValidationErrors = {};
    const caErr = validateAddress(data.currentAddress);
    if (caErr) newErrors.currentAddress = caErr;
    const paErr = validateAddress(data.permanentAddress);
    if (paErr) newErrors.permanentAddress = paErr;
    if (!isViewMode) {
      const cProofErr = validateFileConditional(data.currentAddressProof, 'Current address proof');
      if (cProofErr) newErrors.currentAddressProof = cProofErr;
      const pProofErr = validateFileConditional(data.permanentAddressProof, 'Permanent address proof');
      if (pProofErr) newErrors.permanentAddressProof = pProofErr;
    }
    return newErrors;
  };

  const handleAddressChange = (field: 'currentAddress' | 'permanentAddress', value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (field: 'currentAddressProof' | 'permanentAddressProof', file: File | null) => {
    setAddressData((prev) => ({ ...prev, [field]: file }));
    if (field === 'currentAddressProof') {
      setProofNames((p) => ({ ...p, current: null }));
    } else {
      setProofNames((p) => ({ ...p, permanent: null }));
    }
    if ((errors as any)[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateAddressAPI = async (data: AddressData) => {
    try {
      setButtonLoading(true);
      const fd = new FormData();
      fd.append('current_address', data.currentAddress || '');
      fd.append('permanent_address', data.permanentAddress || '');
      if (data.currentAddressProof instanceof File) {
        fd.append('current_address_proof', data.currentAddressProof, data.currentAddressProof.name);
      }
      if (data.permanentAddressProof instanceof File) {
        fd.append('permanent_address_proof', data.permanentAddressProof, data.permanentAddressProof.name);
      }
      const url = `/api/usersProfile/update?user_id=${encodeURIComponent(String(userId ?? ''))}`;
      const result = await api.put(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const payload = result?.data?.data || result?.data || {};
      const returnedCurrent =
        payload.currentAddressProof ??
        payload.current_address_proof ??
        payload.currentAddressProofUrl ??
        payload.current_address_proof_url ??
        payload.current_proof ??
        null;
      const returnedPermanent =
        payload.permanentAddressProof ??
        payload.permanent_address_proof ??
        payload.permanentAddressProofUrl ??
        payload.permanent_address_proof_url ??
        payload.permanent_proof ??
        null;
      setAddressData((prev) => ({
        ...prev,
        currentAddressProof: returnedCurrent ?? (prev.currentAddressProof instanceof File ? prev.currentAddressProof : prev.currentAddressProof),
        permanentAddressProof: returnedPermanent ?? (prev.permanentAddressProof instanceof File ? prev.permanentAddressProof : prev.permanentAddressProof)
      }));
      setProofNames({
        current: filenameFrom(returnedCurrent) ?? (addressData.currentAddressProof instanceof File ? addressData.currentAddressProof.name : proofNames.current),
        permanent: filenameFrom(returnedPermanent) ?? (addressData.permanentAddressProof instanceof File ? addressData.permanentAddressProof.name : proofNames.permanent)
      });
      showToast('success', 'Address updated successfully');
      return result;
    } catch (error: any) {
      console.error('Update error:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to update address';
      showToast('error', message);
      return null;
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSave = async () => {
    const newErrors = validateForm(addressData);
    setErrors(newErrors);
    onValidationChange?.(Object.keys(newErrors).length === 0);

    if (Object.keys(newErrors).length > 0) {
      showToast('error', 'Fix validation errors before saving');
      return;
    }

    const result = await updateAddressAPI(addressData);
    if (result !== null) {
      setEditMode(false);
      setIsFirstTime(false);
      onValidationChange?.(true);
    }
  };

  const handleNextButton = () => {
    if (isViewMode) {
      onNext?.();
      return;
    }
    const newErrors = validateForm(addressData);
    setErrors(newErrors);
    onValidationChange?.(Object.keys(newErrors).length === 0);
    if (Object.keys(newErrors).length > 0) {
      showToast('error', 'Fix validation errors before proceeding.');
      return;
    }
    onNext?.();
  };

  const handleEdit = () => {
    setEditMode(true);
    setErrors({});
  };

  const handleCancel = async () => {
    setEditMode(false);
    setErrors({});
    await fetchAddressData();
  };

  const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  const proofLabelText = (value: MaybeFileOrUrl, fallbackName?: string | null) => {
    if (!value && !fallbackName) return 'Upload';
    if (value instanceof File) return value.name;
    if (typeof value === 'string') return filenameFrom(value) ?? value;
    return fallbackName ?? 'Upload';
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg">
        <div className="border-l-4 border-yellow-400 pl-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Current Address */}
              <div className="mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <>
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 p-1 text-sm bg-gray-50 text-gray-700"
                      rows={2}
                      value={addressData.currentAddress}
                      disabled
                      placeholder="Current Address"
                    />
                    <ErrorMessage error={errors.currentAddress} />
                  </>
                ) : (
                  <>
                    <textarea
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        errors.currentAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      rows={2}
                      value={addressData.currentAddress}
                      onChange={(e) => handleAddressChange('currentAddress', e.target.value)}
                      placeholder="Current address"
                    />
                    <ErrorMessage error={errors.currentAddress} />
                  </>
                )}
              </div>
              {/* Permanent Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <>
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-1 text-sm bg-gray-50 text-gray-700"
                      rows={2}
                      value={addressData.permanentAddress}
                      disabled
                      placeholder="Permanent Address"
                    />
                    <ErrorMessage error={errors.permanentAddress} />
                  </>
                ) : (
                  <>
                    <textarea
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        errors.permanentAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      rows={2}
                      value={addressData.permanentAddress}
                      onChange={(e) => handleAddressChange('permanentAddress', e.target.value)}
                      placeholder="Permanent Address"
                    />
                    <ErrorMessage error={errors.permanentAddress} />
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address Proof <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <>
                    <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded bg-gray-50">
                      <span className="text-sm text-gray-700">{proofNames.current ?? 'No file uploaded'}</span>
                      <Download className="w-5 h-5 text-gray-400" />
                    </div>
                    <ErrorMessage error={errors.currentAddressProof} />
                  </>
                ) : (
                  <>
                    <label
                      className={`flex items-center justify-between w-full px-3 py-2 border rounded cursor-pointer transition-colors ${
                        errors.currentAddressProof ? 'border-red-500 bg-red-50 hover:bg-red-100' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm text-gray-700">
                        {proofLabelText(addressData.currentAddressProof, proofNames.current)}
                      </span>

                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange('currentAddressProof', e.target.files?.[0] || null)}
                      />
                      <Download className="w-5 h-5 text-gray-400" />
                    </label>
                    <ErrorMessage error={errors.currentAddressProof} />
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Address Proof <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <>
                    <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded bg-gray-50">
                      <span className="text-sm text-gray-700">{proofNames.permanent ?? 'No file uploaded'}</span>
                    </div>
                    <ErrorMessage error={errors.permanentAddressProof} />
                  </>
                ) : (
                  <>
                    <label
                      className={`flex items-center justify-between w-full px-3 py-2 border rounded cursor-pointer transition-colors ${
                        errors.permanentAddressProof ? 'border-red-500 bg-red-50 hover:bg-red-100' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm text-gray-700">
                        {proofLabelText(addressData.permanentAddressProof, proofNames.permanent)}
                      </span>

                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange('permanentAddressProof', e.target.files?.[0] || null)}
                      />
                      <Download className="w-5 h-5 text-gray-400" />
                    </label>
                    <ErrorMessage error={errors.permanentAddressProof} />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white py-2 flex justify-end gap-3 border-t mt-12">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
              disabled={editMode}
            >
              Edit
            </button>
            <button
              onClick={handleSave}
              disabled={buttonLoading || isViewMode}
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium transition-colors disabled:bg-gray-300 disabled:text-black/50"
            >
              {buttonLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleNextButton}
              disabled={buttonLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-60"
            >
              Next
            </button>
            {editMode && (
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <div
          className={`fixed right-4 bottom-6 z-50 rounded px-4 py-2 shadow ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default Address;
