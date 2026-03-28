import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useEmployeeStore } from "@/store/employeeStore";
import toast from "react-hot-toast";

const EmployeeModal = ({ isOpen, onClose, employeeToEdit = null }) => {
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    designation: "",
    age: "",
    payScale: "",
    basicPay: "",
    office: "",
    address: "",
    code: "",
    mobile: "",
    remark: "",
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || "",
        gender: employeeToEdit.gender || "Male",
        designation: employeeToEdit.designation || "",
        age: employeeToEdit.age || "",
        payScale: employeeToEdit.payScale || "",
        basicPay: employeeToEdit.basicPay || "",
        office: employeeToEdit.office || "",
        address: employeeToEdit.address || "",
        code: employeeToEdit.code || "",
        mobile: employeeToEdit.mobile || "",
        remark: employeeToEdit.remark || "",
      });
    } else {
      setFormData({
        name: "",
        gender: "Male",
        designation: "",
        age: "",
        payScale: "",
        basicPay: "",
        office: "",
        address: "",
        code: "",
        mobile: "",
        remark: "",
      });
    }
  }, [employeeToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.mobile) {
      toast.error("Name, Code and Mobile are required");
      return;
    }

    if (employeeToEdit) {
      updateEmployee(formData);
      toast.success("Employee updated successfully");
    } else {
      addEmployee(formData);
      toast.success("Employee added successfully");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0">
          <h3 className="text-xl font-bold text-slate-800">
            {employeeToEdit ? "Edit Employee" : "Add New Employee"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Code Number *
            </label>
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={!!employeeToEdit}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
              placeholder="Unique Employee Code"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Full Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Employee Name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Designation
            </label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Clerk, Peon"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Mobile Number *
            </label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="10 digit mobile"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Office/Dept
            </label>
            <input
              name="office"
              value={formData.office}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Health Dept"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Age</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Pay Scale
            </label>
            <input
              name="payScale"
              value={formData.payScale}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Basic Pay
            </label>
            <input
              name="basicPay"
              type="number"
              value={formData.basicPay}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Remarks
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Save size={18} />
              <span>Save Employee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
