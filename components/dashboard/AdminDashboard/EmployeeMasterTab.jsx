"use client";
import React, { useState } from "react";
import { useEmployeeStore } from "@/store/employeeStore";
import {
  Plus,
  Upload,
  Search,
  FileSpreadsheet,
  Trash2,
  Edit,
  Filter,
  Download,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import EmployeeModal from "./EmployeeModal";

const EmployeeMasterTab = () => {
  const employees = useEmployeeStore((state) => state.employees);
  const addEmployeesBulk = useEmployeeStore((state) => state.addEmployeesBulk);
  const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Filter employees
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.mobile?.includes(searchTerm) ||
      emp.office?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        // Map excel columns to our schema needed
        // Expected columns: Name, Gender, Designation, Age, Pay Scale, Basic Pay, Office, Address, Code, Mobile, Remark
        const mappedData = data
          .map((row) => ({
            name: row["Employee Name"] || row["Name"],
            gender: row["Gender"],
            designation: row["Designation"],
            age: row["Age"],
            payScale: row["Pay Scale"],
            basicPay: row["Basic Pay"],
            office: row["Office Name"] || row["Office"],
            address: row["Address"],
            code: row["Code Number"] || row["Code"],
            mobile: row["Mobile Number"] || row["Mobile"],
            remark: row["Remark"],
          }))
          .filter((item) => item.name && item.code); // Basic validation

        if (mappedData.length === 0) {
          toast.error(
            "No valid records found in Excel. Please check column headers."
          );
          return;
        }

        addEmployeesBulk(mappedData);
        toast.success(`Successfully imported ${mappedData.length} employees`);
        e.target.value = null; // Reset input
      } catch (error) {
        console.error("Import Error:", error);
        toast.error("Failed to parse Excel file");
      }
    };
    reader.readAsBinaryString(file);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employee_Master.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employee Master</h2>
          <p className="text-slate-500 text-sm">
            Manage municipal staff records and assignments
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FileSpreadsheet size={18} />
              <span>Import Excel</span>
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30"
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, code, office..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Office
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {emp.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div className="font-medium text-slate-900">
                        {emp.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {emp.gender}, {emp.age} yrs
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {emp.designation}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {emp.office}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {emp.mobile}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Users className="text-slate-400" size={24} />
                      </div>
                      <p className="text-lg font-medium text-slate-700">
                        No employees found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or add new employees
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredEmployees.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
            <span>Showing {filteredEmployees.length} records</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeToEdit={editingEmployee}
      />
    </div>
  );
};

export default EmployeeMasterTab;
