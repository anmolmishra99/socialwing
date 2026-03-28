"use client";
import React from "react";
import { BarChart3, PieChart, FileText } from "lucide-react";
import toast from "react-hot-toast";

const ReportsTab = () => {
  const reports = [
    {
      title: "Staff Deployment Report",
      desc: "Detailed breakdown of staff allocated to each polling station.",
      icon: BarChart3,
    },
    {
      title: "Attendance Summary",
      desc: "Consolidated attendance status for training and polling day.",
      icon: PieChart,
    },
    {
      title: "Exemption List",
      desc: "List of employees exempted from duty with reasons.",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">MIS Reports</h2>
        <p className="text-slate-500 text-sm">
          System wide analytics and reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
            onClick={() => toast.success(`Generated ${report.title}`)}
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <report.icon size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{report.title}</h3>
            <p className="text-sm text-slate-500">{report.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsTab;
