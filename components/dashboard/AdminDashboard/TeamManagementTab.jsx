"use client";
import React, { useState } from "react";
import { useEmployeeStore } from "@/store/employeeStore";
import { useTeamStore } from "@/store/teamStore";
import {
  Users,
  Settings,
  RefreshCw,
  Save,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const TeamManagementTab = () => {
  const employees = useEmployeeStore((state) => state.employees);
  const { teams, reserves, hasGenerated, generateTeams, disbandTeams } =
    useTeamStore();

  const [config, setConfig] = useState({
    totalTeams: 10,
    proCount: 1,
    poCount: 3,
  });

  const uniqueDesignations = [
    ...new Set(employees.map((e) => e.designation).filter(Boolean)),
  ];

  const handleGenerate = () => {
    if (employees.length === 0) {
      toast.error(
        "No employees found in master. Please import employees first."
      );
      return;
    }

    const requiredStaff =
      config.totalTeams * (config.proCount + config.poCount);
    if (employees.length < requiredStaff) {
      toast.error(
        `Not enough staff. Need ${requiredStaff}, have ${employees.length}`
      );
      return;
    }

    const result = generateTeams(employees, {
      totalTeams: config.totalTeams,
      composition: { pro: config.proCount, po: config.poCount },
    });

    toast.success(
      `Generated ${result.created} teams. ${result.reserves} in reserve.`
    );
  };

  const handleDisband = () => {
    if (confirm("Are you sure you want to disband all current teams?")) {
      disbandTeams();
      toast.success("Teams disbanded");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Management</h2>
          <p className="text-slate-500 text-sm">
            Automated randomization and polling party formation
          </p>
        </div>
        {hasGenerated && (
          <button
            onClick={handleDisband}
            className="flex items-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
          >
            <RefreshCw size={18} />
            <span>Disband & Reset</span>
          </button>
        )}
      </div>

      {/* Configuration Card */}
      {!hasGenerated && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-3">
            <Settings size={20} className="text-orange-500" />
            <h3>Formation Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Total Teams Required
              </label>
              <input
                type="number"
                value={config.totalTeams}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    totalTeams: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-slate-500">
                Based on number of polling stations
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Presiding Officers (PrO) per Team
              </label>
              <input
                type="number"
                value={config.proCount}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    proCount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Polling Officers (PO) per Team
              </label>
              <input
                type="number"
                value={config.poCount}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    poCount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-blue-800">
              <span className="font-semibold">Requirement Check:</span>
              <div className="mt-1">
                Needed:{" "}
                <span className="font-bold">
                  {(config.proCount + config.poCount) * config.totalTeams}
                </span>{" "}
                staff members. Available:{" "}
                <span className="font-bold">{employees.length}</span> staff
                members.
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-500/30 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span>Generate Teams</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Area */}
      {hasGenerated && (
        <div className="space-y-8">
          {/* Teams List */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Formed Teams ({teams.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
                >
                  <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">
                      {team.name}
                    </span>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {team.stationId}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member, idx) => (
                      <div
                        key={member.id}
                        className="text-sm flex items-start gap-2"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                            idx < config.proCount
                              ? "bg-indigo-500"
                              : "bg-slate-400"
                          }`}
                        >
                          {idx < config.proCount
                            ? "PrO"
                            : `P${idx - config.proCount + 1}`}
                        </div>
                        <div>
                          <div className="text-slate-900 font-medium leading-tight">
                            {member.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {member.designation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reserves List */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-green-600" />
              Reserve Pool ({reserves.length})
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-500">
                      Name
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-500">
                      Designation
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-500">
                      Office
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-500">
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reserves.slice(0, 50).map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {emp.name}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {emp.designation}
                      </td>
                      <td className="px-6 py-3 text-slate-600">{emp.office}</td>
                      <td className="px-6 py-3 text-slate-600">{emp.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reserves.length > 50 && (
                <div className="p-4 text-center text-slate-500 text-xs border-t border-slate-200">
                  + {reserves.length - 50} more in reserve
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementTab;
