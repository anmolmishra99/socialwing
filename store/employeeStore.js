import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

const employeeStore = (set, get) => ({
  employees: [],
  
  // Add single employee
  addEmployee: (employee) => set((state) => ({ 
    employees: [...state.employees, { ...employee, id: crypto.randomUUID() }] 
  }), false, "addEmployee"),

  // Bulk add employees (for Excel import)
  addEmployeesBulk: (newEmployees) => set((state) => ({
    employees: [...state.employees, ...newEmployees.map(emp => ({ ...emp, id: emp.id || crypto.randomUUID() }))]
  }), false, "addEmployeesBulk"),

  // Update employee
  updateEmployee: (updatedEmployee) => set((state) => ({
    employees: state.employees.map((emp) => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    )
  }), false, "updateEmployee"),

  // Delete employee (soft delete implementation can be added later if needed, for now hard delete)
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter((emp) => emp.id !== id)
  }), false, "deleteEmployee"),

  // Clear all
  clearEmployees: () => set({ employees: [] }, false, "clearEmployees"),
});

export const useEmployeeStore = create(
  persist(devtools(employeeStore), {
    name: "employee-storage",
    storage: createJSONStorage(() => localStorage),
  })
);
