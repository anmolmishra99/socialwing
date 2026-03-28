"use client";
import React, { useState } from "react";
import { useTeamStore } from "@/store/teamStore";
import { useAttendanceStore } from "@/store/attendanceStore";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const AttendanceTab = () => {
  const { teams, hasGenerated } = useTeamStore();
  const { attendance, markAttendance, getStats } = useAttendanceStore();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = getStats(teams);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.stationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const toggleAttendance = (teamId, memberId, currentStatus) => {
    // currentStatus: true (present) -> click -> mark false (absent)
    // undefined (default present) -> click -> mark false (absent)
    // false (absent) -> click -> mark true (present)
    const isAbsent = currentStatus === false;
    markAttendance(teamId, memberId, isAbsent); // Toggle back to true (present) or false (absent)
  };

  if (!hasGenerated || teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-slate-200">
        <AlertTriangle size={48} className="text-orange-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Teams Not Formed</h3>
        <p className="text-slate-500">
          Please generate polling parties in the Team Management tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Attendance Management
          </h2>
          <p className="text-slate-500 text-sm">
            Track reporting of polling staff
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4 text-sm font-medium">
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-2">
            <CheckCircle2 size={16} />
            Present: {stats.presentCount}
          </div>
          <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
            <XCircle size={16} />
            Absent: {stats.absentCount}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search teams or staff name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm"
        />
      </div>

      {/* Attendance Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800">{team.name}</span>
              <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                {team.stationId}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {team.members.map((member) => {
                const key = `${team.id}-${member.id}`;
                const isPresent = attendance[key] !== false; // Default true

                return (
                  <div
                    key={member.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isPresent ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {member.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {member.designation} • {member.mobile}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        toggleAttendance(team.id, member.id, attendance[key])
                      }
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isPresent
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 w-24"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 w-24"
                      }`}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTab;
