import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

const attendanceStore = (set, get) => ({
  attendance: {}, // Map of key "teamId-memberId" -> boolean (true=present, false=absent)
  
  markAttendance: (teamId, memberId, isPresent) => set((state) => ({
    attendance: { 
        ...state.attendance, 
        [`${teamId}-${memberId}`]: isPresent 
    }
  }), false, "markAttendance"),

  bulkMarkAttendance: (teamId, members, isPresent) => set((state) => {
     const updates = {};
     members.forEach(m => {
         updates[`${teamId}-${m.id}`] = isPresent;
     });
     return { attendance: { ...state.attendance, ...updates } };
  }, false, "bulkMarkAttendance"),

  getStats: (teams) => {
      const state = get();
      let totalStaff = 0;
      let presentCount = 0;

      teams.forEach(team => {
          team.members.forEach(member => {
              totalStaff++;
              const key = `${team.id}-${member.id}`;
              // Default to true (present) if not set, or handle as pending. 
              // For this system, let's assume default is Present unless marked Absent
              // Or better, let's assume default is Pending? No, usually default Present.
              // Let's strictly check: undefined = Pending/Present?
              // Let's assume explicitly marked absent is false. undefined or true is Present.
              // Actually for safe default, let's say all are Present.
              if (state.attendance[key] !== false) {
                  presentCount++;
              }
          });
      });

      return { totalStaff, presentCount, absentCount: totalStaff - presentCount };
  }
});

export const useAttendanceStore = create(
  persist(devtools(attendanceStore), {
    name: "attendance-storage",
    storage: createJSONStorage(() => localStorage),
  })
);
