"use client";
import React from "react";
import { CreditCard, Download } from "lucide-react";
import toast from "react-hot-toast";

const PaymentsTab = () => {
  const handleGenerateValues = () => {
    toast.success("Payment values calculated successfully");
  };

  const handleDownloadOrder = () => {
    toast.success("Payment Order PDF downloaded");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Payment Processing
        </h2>
        <p className="text-slate-500 text-sm">
          Manage election duty allowances and payments
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
          <CreditCard size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Allowance Management
        </h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Calculate and generate payment orders for training allowance, polling
          day allowance, and travel expenses.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGenerateValues}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Calculate Allowances
          </button>
          <button
            onClick={handleDownloadOrder}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-500/30"
          >
            <Download size={18} />
            <span>Generate Payment Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
