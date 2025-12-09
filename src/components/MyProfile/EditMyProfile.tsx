import React, { useCallback, useEffect, useState } from 'react';
import { User, CreditCard, FileText, DollarSign, Briefcase } from 'lucide-react';
import Family from '../MyProfile/Family';
import Education from '../MyProfile/Education';
import Address from '../MyProfile/Address';
import BankAccount from '../MyProfile/BankAccount';
import IdentityProof from '../MyProfile/IdentityProof';
import AssetDeclaration from '../MyProfile/AssetDeclaration';
import AnnualInvestment from '../MyProfile/AnnualInvestment';
import Income from '../MyProfile/Income';
import BasicInformation from './BasicInformation';
import api from '@/api/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Form12C from './Form12C';
import ProfileTopHeader from './ProfileTopHeader';
interface DeclarationItem {
  declaration_type: string;
  opening_date: string;
  closing_date: string;
  is_active: boolean;
  dec_id: number;
}

function EditMyProfile() {
  const [activeSection, setActiveSection] = useState('basic');
  const [profileData, setProfileData] = useState<any>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [sectionValidation, setSectionValidation] = useState<{ [key: string]: boolean }>({});
  const [declarationData, setDeclarationData] = useState<DeclarationItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ user_id?: string }>();
  const shouldFetch = location.state?.shouldFetch ?? true;
  const storedUser = localStorage.getItem("userData");
  const loggedInUserId = storedUser ? JSON.parse(storedUser)?.userId : null;
  const isHRAdminRoute = location.pathname.includes('/user-management/manage-user/edit-profile');

  const getUserIdFromPath = () => {
    if (isHRAdminRoute) {
      const pathParts = location.pathname.split('/');
      return pathParts[pathParts.length - 1];
    }
    return null;
  };

  const userIdToFetch = isHRAdminRoute 
    ? (params.user_id || getUserIdFromPath()) 
    : loggedInUserId;

  const menuItems = [
    { id: 'basic', label: 'Basic Information', icon: User },
    { id: 'family', label: 'Family', icon: User },
    { id: 'education', label: 'Education', icon: User },
    { id: 'address', label: 'Address', icon: User },
    { id: 'bank', label: 'Bank Account', icon: CreditCard },
    { id: 'identity', label: 'Identity Proof', icon: FileText },
    { id: 'asset', label: 'Asset Declaration', icon: Briefcase },
    { id: 'annual', label: 'Annual Investment', icon: DollarSign },
    { id: 'income', label: 'Form 12 C', icon: DollarSign },
  ];

  useEffect(() => {
    if (!shouldFetch || !userIdToFetch) return;
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/usersProfile/${userIdToFetch}`);
        setProfileData(res.data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
        toast.error("Failed to fetch profile data");
      }
    };
    fetchProfile();
  }, [shouldFetch, userIdToFetch]);

  useEffect(() => {
    const fetchDeclarationData = async () => {
      try {
        const res = await api.get(`/api/declaration/`);
        setDeclarationData(res.data);
      } catch (error) {
        console.error("Declaration fetch failed:", error);
        toast.error("Failed to fetch declaration data");
      }
    };
    fetchDeclarationData();
  }, []);

  const isSectionActive = (sectionId: string) => {
    const item = declarationData.find(d => {
      if (sectionId === 'asset') return d.declaration_type === 'Assest Declaration';
      if (sectionId === 'investment') return d.declaration_type === 'Investment Declaration';
      if (sectionId === 'income') return d.declaration_type === 'Form 12 C';
      return true;
    });
    return item ? item.is_active : true;
  };

  const currentIndex = menuItems.findIndex(item => item.id === activeSection);

  const handleNext = () => {
    if (!sectionValidation[activeSection]) {
      toast.error('Please fill all required fields before proceeding next.');
      return;
    }
    setCompletedSteps((prev) =>
      prev.includes(activeSection) ? prev : [...prev, activeSection]
    );
    if (currentIndex < menuItems.length - 1) {
      setActiveSection(menuItems[currentIndex + 1].id);
    }
  };

  const handleValidationChange = (sectionId: string, isValid: boolean) => {
    setSectionValidation(prev => ({ ...prev, [sectionId]: isValid }));
  };

  const handleBasicValidation = useCallback(
    (isValid: boolean) => handleValidationChange('basic', isValid),
    []
  );

  return (
    <>
      <div className="rounded-md">
        <ProfileTopHeader
          title="Employee Personal Information"
          subTitle="Manage employee records and declarations"
          onAddClick={() => navigate("/hr-admin/personal-updates/asset-submitted")}
        />
      </div>
      <div className="flex bg-gray-50 min-h-screen overflow-scroll">
        <div className="flex-1 p-1">
          <BasicInformation
            isActive={activeSection === "basic"}
            profileData={profileData}
            onNext={handleNext}
            onValidationChange={handleBasicValidation}
          />
          <Family
            isActive={activeSection === 'family'}
            onNext={handleNext}
            onValidationChange={(isValid) => handleValidationChange('family', isValid)}
            // profileData={profileData}
          />
          <Education
            isActive={activeSection === 'education'}
            onNext={handleNext}
            profileData={profileData}
            onValidationChange={(isValid) => handleValidationChange('education', isValid)}
          />
          <Address
            isActive={activeSection === 'address'}
            onNext={handleNext}
            onValidationChange={(isValid) => handleValidationChange('address', isValid)}
          />
          <BankAccount
            isActive={activeSection === 'bank'}
            onNext={handleNext}
            profileData={profileData}
            onValidationChange={(isValid) => handleValidationChange('bank', isValid)}
          />
          <IdentityProof
            isActive={activeSection === 'identity'}
            onNext={handleNext}
            profileData={profileData}
            onValidationChange={(isValid) => handleValidationChange('identity', isValid)}
          />
          <AssetDeclaration
            isActive={activeSection === 'asset'}
            onNext={handleNext}
            onValidationChange={(isValid) => handleValidationChange('asset', isValid)}
          />
          <AnnualInvestment
            isActive={activeSection === 'annual'}
            onNext={handleNext}
            onValidationChange={(isValid) => handleValidationChange('annual', isValid)}
          />
          <Form12C
            isActive={activeSection === 'income'}
          />
          <Income
            isActive={activeSection === 'income'}
          />
        </div>
        {/* Sidebar */}
        <div className="w-60 bg-white shadow-lg p-1">
          <div className="sticky top-4 flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = item.id === activeSection;
              const isCompleted = completedSteps.includes(item.id);
              const sectionEnabled = isSectionActive(item.id);
              const isClickable = isCompleted || isCurrent || sectionEnabled;
              return (
                <div
                  key={item.id}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isClickable ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}`}
                  onClick={() => isClickable && setActiveSection(item.id)}
                >
                  <Icon size={18} className={isCurrent ? "text-blue-600" : isCompleted ? "text-gray-600" : "text-gray-400"} />
                  <span className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                  {!sectionEnabled && !isCompleted && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">🔒</span>
                  )}
                  {isCurrent && !isCompleted && sectionEnabled && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600"></span>
                  )}
                  {isCompleted && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditMyProfile;
