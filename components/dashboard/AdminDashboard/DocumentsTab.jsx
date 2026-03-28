"use client";
import React from "react";
import { useTeamStore } from "@/store/teamStore";
import { useEmployeeStore } from "@/store/employeeStore";
import {
  generateTeamOrderPDF,
  generateOfficeOrderPDF,
} from "@/utils/pdfGenerator";
import { FileText, Download, Printer } from "lucide-react";
import toast from "react-hot-toast";

const DocumentsTab = () => {
  const { teams, hasGenerated } = useTeamStore();
  const employees = useEmployeeStore((state) => state.employees);

  // Get unique offices
  const uniqueOffices = [
    ...new Set(employees.map((e) => e.office).filter(Boolean)),
  ];

  const handleTeamOrder = () => {
    if (!hasGenerated || teams.length === 0) {
      toast.error("No teams generated yet. Go to Team Management first.");
      return;
    }
    generateTeamOrderPDF(teams);
    toast.success("Team Orders Generated");
  };

  const handleOfficeOrder = (office) => {
    const officeEmployees = employees.filter((e) => e.office === office);
    generateOfficeOrderPDF(office, officeEmployees);
    toast.success(`Order generated for ${office}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Document Generation
        </h2>
        <p className="text-slate-500 text-sm">
          Download official orders and notices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Team Formation Orders
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Generate appointment orders for all {teams.length} teams with member
            details.
          </p>
          <button
            onClick={handleTeamOrder}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Office Wise Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow col-span-1 md:col-span-2">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
            <Printer size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Office-wise Lists
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Generate consolidated lists for specific offices.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
            {uniqueOffices.map((office) => (
              <button
                key={office}
                onClick={() => handleOfficeOrder(office)}
                className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-200 text-left"
              >
                <span className="font-medium text-slate-700 truncate">
                  {office}
                </span>
                <Download size={14} className="text-slate-400" />
              </button>
            ))}
            {uniqueOffices.length === 0 && (
              <div className="text-sm text-slate-400 col-span-3 text-center py-4">
                No offices found in master data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
