// ==========================================
// FILE: Income.tsx
// ==========================================
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface IncomeProps {
  isActive: boolean;
}

interface Salary {
  basic: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  bonus: number;
  pf: number;
}

interface OtherIncome {
  interestIncome: number;
  rentalIncome: number;
  capitalGains: number;
  businessIncome: number;
  otherSources: number;
}

interface TaxDeductions {
  section80C: number;
  section80D: number;
  section24B: number;
  hra: number;
}

interface IncomeData {
  salary: Salary;
  otherIncome: OtherIncome;
  taxDeductions: TaxDeductions;
}

const Income: React.FC<IncomeProps> = ({ isActive }) => {
  const [selectedYear, setSelectedYear] = useState<string>('2024-2025');
  const [incomeData] = useState<IncomeData>({
    salary: {
      basic: 50000,
      hra: 20000,
      conveyance: 1600,
      medicalAllowance: 1250,
      specialAllowance: 15000,
      bonus: 10000,
      pf: 6000
    },
    otherIncome: {
      interestIncome: 5000,
      rentalIncome: 15000,
      capitalGains: 0,
      businessIncome: 0,
      otherSources: 0
    },
    taxDeductions: {
      section80C: 150000,
      section80D: 25000,
      section24B: 0,
      hra: 80000
    }
  });

  if (!isActive) return null;

  const calculateMonthlySalary = (): number => {
    const salary = incomeData.salary;
    return salary.basic + salary.hra + salary.conveyance + 
           salary.medicalAllowance + salary.specialAllowance - salary.pf;
  };

  const calculateAnnualSalary = (): number => {
    return calculateMonthlySalary() * 12 + incomeData.salary.bonus;
  };

  const calculateTotalOtherIncome = (): number => {
    return Object.values(incomeData.otherIncome).reduce((sum, val) => sum + val, 0);
  };

  const calculateGrossIncome = (): number => {
    return calculateAnnualSalary() + calculateTotalOtherIncome();
  };

  const calculateTotalDeductions = (): number => {
    return Object.values(incomeData.taxDeductions).reduce((sum, val) => sum + val, 0);
  };

  const calculateTaxableIncome = (): number => {
    return Math.max(0, calculateGrossIncome() - calculateTotalDeductions());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Income Summary</h3>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-600" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-2025">FY 2024-2025</option>
            <option value="2023-2024">FY 2023-2024</option>
            <option value="2022-2023">FY 2022-2023</option>
          </select>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-blue-600" />
          Monthly Salary Structure
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Basic Salary</p>
            <p className="text-lg font-bold text-gray-800">₹{incomeData.salary.basic.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">HRA</p>
            <p className="text-lg font-bold text-gray-800">₹{incomeData.salary.hra.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Conveyance</p>
            <p className="text-lg font-bold text-gray-800">₹{incomeData.salary.conveyance.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Medical Allowance</p>
            <p className="text-lg font-bold text-gray-800">₹{incomeData.salary.medicalAllowance.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Special Allowance</p>
            <p className="text-lg font-bold text-gray-800">₹{incomeData.salary.specialAllowance.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm border-l-4 border-red-500">
            <p className="text-xs text-gray-600">PF Deduction</p>
            <p className="text-lg font-bold text-red-600">-₹{incomeData.salary.pf.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-600 text-white rounded flex justify-between items-center">
          <span className="font-medium">Monthly Take Home</span>
          <span className="text-2xl font-bold">₹{calculateMonthlySalary().toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Annual Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-600" />
            <h4 className="font-semibold text-gray-700">Annual Salary</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">₹{calculateAnnualSalary().toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-600 mt-1">Includes annual bonus</p>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Other Income</h4>
          <p className="text-3xl font-bold text-purple-600">₹{calculateTotalOtherIncome().toLocaleString('en-IN')}</p>
          <div className="mt-2 text-xs text-gray-600">
            {incomeData.otherIncome.interestIncome > 0 && <p>Interest: ₹{incomeData.otherIncome.interestIncome.toLocaleString('en-IN')}</p>}
            {incomeData.otherIncome.rentalIncome > 0 && <p>Rental: ₹{incomeData.otherIncome.rentalIncome.toLocaleString('en-IN')}</p>}
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-4">Tax Calculation Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-orange-200">
            <span className="text-gray-700">Gross Annual Income</span>
            <span className="font-bold text-gray-800">₹{calculateGrossIncome().toLocaleString('en-IN')}</span>
          </div>
          
          <div className="pl-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Section 80C</span>
              <span className="text-green-600">-₹{incomeData.taxDeductions.section80C.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Section 80D</span>
              <span className="text-green-600">-₹{incomeData.taxDeductions.section80D.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">HRA Exemption</span>
              <span className="text-green-600">-₹{incomeData.taxDeductions.hra.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t-2 border-orange-300">
            <span className="font-semibold text-gray-700">Total Deductions</span>
            <span className="font-bold text-green-600">₹{calculateTotalDeductions().toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-orange-200 rounded mt-3">
            <span className="font-bold text-gray-800">Taxable Income</span>
            <span className="text-2xl font-bold text-orange-700">₹{calculateTaxableIncome().toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Form 16 Download */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-3">Download Documents</h4>
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Download Form 16
          </button>
          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
            Download Salary Slip
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is an auto-calculated summary based on your salary structure and declared investments. For exact tax calculation, please consult with a tax professional.
        </p>
      </div>
    </div>
  );
};

export default Income;