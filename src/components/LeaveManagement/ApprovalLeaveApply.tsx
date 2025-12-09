import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface FormData {
    name: string;
    leaveType: string;
    numberOfDays: number;
    fromDate: string;
    toDate: string;
    reason: string;
    address: string;
    phoneNumber: string;
    comments: string;
}

interface ApprovalLeaveApplyProps {
    onClose?: () => void;
}

function ApprovalLeaveApply({ onClose }: ApprovalLeaveApplyProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        leaveType: '',
        numberOfDays: 1,
        fromDate: '',
        toDate: '',
        reason: '',
        address: '',
        phoneNumber: '',
        comments: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Leave application submitted successfully!');
        handleClose();
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const handleCancel = () => {
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'numberOfDays' ? Number(value) : value
        }));
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[100vh] relative max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-2 ml-3 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Apply for Leave</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <div className="p-5 -mt-3 overflow-y-auto flex-1">
                    <div className="space-y-3">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Type of Leave and Number of Days */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type of Leave*
                                </label>
                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-500"
                                >
                                    <option value="">Select leave type</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="casual">Casual Leave</option>
                                    <option value="annual">Annual Leave</option>
                                    <option value="unpaid">Unpaid Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Days
                                </label>
                                <input
                                    type="number"
                                    name="numberOfDays"
                                    value={formData.numberOfDays}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* From Date and To Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From Date*
                                </label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To Date*
                                </label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Reason for Leave */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Leave
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter reason for leave"
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y min-h-[60px]"
                            />
                        </div>

                        {/* Contact Address & Telephone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Address & Telephone (While on leave)
                            </label>
                            <div className="space-y-3">
                                <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                                    <label className="text-sm text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Add address"
                                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                                    <label className="text-sm text-gray-700">
                                        Ph No.
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Comments (initiator)
                            </label>
                            <textarea
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                placeholder="Nil"
                                rows={2}
                                className="w-full px-2 py-1 -mb-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y min-h-[60px]"
                            />
                        </div>
                    </div>
                </div>
                {/* Action Buttons - Fixed at bottom */}
                <div className="flex justify-end gap-3 mr-5 border-t bg-white">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-3 py-1 mt-2 mb-2 text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        // onClick={handlePrintPreview}
                        className="px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2 mt-2 mb-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                    </button>
                    <button
                        // onClick={() => updateMocStatus("reject")}
                        className="px-3 py-2 mt-2 mb-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors flex items-center gap-2"
                    >
                        <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                            <X size={14} className="text-red-600" />
                        </div>
                        Reject
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-3 py-2 mt-2 mb-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-2"
                    >
                        <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
                            <Check size={14} className="text-blue-600" />
                        </div>
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApprovalLeaveApply;