import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "@/api/axiosInstance";
import { toast } from 'react-toastify';
export interface DeclarationItem {
  declaration_type: string; // allow any string
  opening_date: string;
  closing_date: string;
  is_active: boolean;
  dec_id: number;
}

export interface FormState {
  enabled: boolean;
  opening: string;
  closing: string;
}

interface AssetDeclarationFormProps {
  isOpen: boolean;
  onClose: () => void;
  declarationData?: DeclarationItem[] | null;
  onSubmit: (data: Record<string, FormState>) => void;
}

const HRAssetDeclarationForm: React.FC<AssetDeclarationFormProps> = ({
  isOpen,
  onClose,
  declarationData = [],
  onSubmit,
}) => {
  const navigate = useNavigate();

  // Use a dynamic map to store any declaration type
  const [formStates, setFormStates] = useState<Record<string, FormState>>({});

  // Populate form whenever modal opens or declarationData changes
  useEffect(() => {
    if (isOpen && declarationData?.length) {
      const newStates: Record<string, FormState> = {};
      declarationData.forEach((item) => {
        newStates[item.declaration_type] = {
          enabled: item.is_active,
          opening: item.opening_date || '',
          closing: item.closing_date || '',
        };
      });
      setFormStates(newStates);
    } else if (!isOpen) {
      setFormStates({});
    }
  }, [isOpen, declarationData]);

  const isInvalidDateRange = (open: string, close: string) => {
    if (!open || !close) return false;
    return new Date(close) <= new Date(open);
  };


const handleSaveSettings = async () => {
  try {
    for (const [type, state] of Object.entries(formStates)) {
      if (state.enabled && isInvalidDateRange(state.opening, state.closing)) {
        alert(`${type}: Closing Date must be greater than Opening Date`);
        return;
      }

      // Find dec_id for this declaration_type
      const decItem = declarationData?.find(item => item.declaration_type === type);
      if (!decItem) {
        console.warn(`Declaration type ${type} not found in original data.`);
        continue;
      }

      const payload = {
        declaration_type: type,
        opening_date: state.opening,
        closing_date: state.closing,
        is_active: state.enabled
      };

      // API call
      await api.put(`/api/declaration/${decItem.dec_id}`, payload);
    }

    toast.success('All declarations updated successfully!');
    onSubmit(formStates);
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong while saving declarations.');
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-[#1E6FBF] text-white px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Employee Personal Information</h2>
            <p className="text-xs text-gray-200 mt-1">Manage employee records and declarations</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {Object.entries(formStates).map(([type, state]) => (
            <DeclarationSection
              key={type}
              title={type}
              state={state}
              setState={(newState) =>
                setFormStates((prev) => ({
                  ...prev,
                  [type]: typeof newState === 'function' ? newState(prev[type]) : newState,
                }))
              }

            />
          ))}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => navigate('/hr-admin/personal-updates/view-submitted')}
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
            >
              View Submitted
            </button>

            <button
              onClick={handleSaveSettings}
              className="px-5 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable section for each declaration
interface DeclarationSectionProps {
  title: string;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
}

const DeclarationSection: React.FC<DeclarationSectionProps> = ({ title, state, setState }) => {
const isInvalidDateRange = (open: string, close: string) => {
  if (!open || !close) return false;
  return new Date(close) < new Date(open); // allow same date
};

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
        <div className="flex items-center gap-3">
          {state.enabled && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Opening Date</label>
                <input
                  type="date"
                  value={state.opening}
                  onChange={(e) => setState({ ...state, opening: e.target.value })}
                  className="pl-2 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Closing Date</label>
                <input
                  type="date"
                  value={state.closing}
                  onChange={(e) => setState({ ...state, closing: e.target.value })}
                  className="pl-2 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isInvalidDateRange(state.opening, state.closing) && (
                  <p className="text-red-500 text-xs">Closing date must be greater than opening date</p>
                )}
              </div>
            </div>
          )}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.enabled}
              onChange={(e) => setState({ ...state, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default HRAssetDeclarationForm;
