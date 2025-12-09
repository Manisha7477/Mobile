import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface InvestmentDeclarationProps {
  isActive: boolean;
}

interface Investment {
  id: number;
  section: string;
  investmentType: string;
  amount: string;
  policyNumber: string;
  startDate: string;
  maturityDate: string;
}

const InvestmentDeclaration: React.FC<InvestmentDeclarationProps> = ({ isActive }) => {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: 1,
      section: '',
      investmentType: '',
      amount: '',
      policyNumber: '',
      startDate: '',
      maturityDate: ''
    }
  ]);

  if (!isActive) return null;

  const handleChange = (id: number, field: keyof Investment, value: string) => {
    setInvestments(investments.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  const addInvestment = () => {
    setInvestments([
      ...investments,
      {
        id: Date.now(),
        section: '',
        investmentType: '',
        amount: '',
        policyNumber: '',
        startDate: '',
        maturityDate: ''
      }
    ]);
  };

  const removeInvestment = (id: number) => {
    if (investments.length > 1) {
      setInvestments(investments.filter(inv => inv.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Investment declarations:', investments);
  };

  const section80CLimit = 150000;
  const totalSection80C = investments
    .filter(inv => inv.section === '80C')
    .reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Investment Declaration</h3>
        <button
          type="button"
          onClick={addInvestment}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          <Plus size={18} />
          Add Investment
        </button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tax Saving Investments:</strong> Declare your investments under Section 80C, 80D, 80G, and other applicable sections for tax benefits.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {investments.map((inv, index) => (
          <div key={inv.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Investment {index + 1}</h4>
              {investments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInvestment(inv.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Tax Section*</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.section}
                  onChange={(e) => handleChange(inv.id, 'section', e.target.value)}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="80C">Section 80C (₹1.5L limit)</option>
                  <option value="80CCD(1B)">Section 80CCD(1B) (₹50K limit)</option>
                  <option value="80D">Section 80D - Health Insurance</option>
                  <option value="80G">Section 80G - Donations</option>
                  <option value="24B">Section 24B - Home Loan Interest</option>
                  <option value="80E">Section 80E - Education Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Investment Type*</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.investmentType}
                  onChange={(e) => handleChange(inv.id, 'investmentType', e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="ppf">Public Provident Fund (PPF)</option>
                  <option value="elss">ELSS Mutual Funds</option>
                  <option value="lic">LIC Premium</option>
                  <option value="nps">National Pension Scheme (NPS)</option>
                  <option value="nsc">National Savings Certificate</option>
                  <option value="fd">Fixed Deposit (Tax Saving)</option>
                  <option value="health_insurance">Health Insurance</option>
                  <option value="home_loan">Home Loan Principal</option>
                  <option value="education_loan">Education Loan Interest</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Amount (₹)*</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.amount}
                  onChange={(e) => handleChange(inv.id, 'amount', e.target.value)}
                  placeholder="Amount invested"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Policy/Account Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.policyNumber}
                  onChange={(e) => handleChange(inv.id, 'policyNumber', e.target.value)}
                  placeholder="Policy or account number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.startDate}
                  onChange={(e) => handleChange(inv.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Maturity Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.maturityDate}
                  onChange={(e) => handleChange(inv.id, 'maturityDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Section 80C Total</h4>
            <p className="text-2xl font-bold text-green-600">
              ₹ {totalSection80C.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {totalSection80C > section80CLimit 
                ? `Exceeds limit by ₹${(totalSection80C - section80CLimit).toLocaleString('en-IN')}`
                : `Remaining: ₹${(section80CLimit - totalSection80C).toLocaleString('en-IN')}`
              }
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Total Investment Declared</h4>
            <p className="text-2xl font-bold text-blue-600">
              ₹ {investments.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default InvestmentDeclaration;