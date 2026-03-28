import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

const teamStore = (set, get) => ({
  teams: [],
  reserves: [],
  hasGenerated: false,

  generateTeams: (employees, config) => {
    // config: { totalTeams: 10, composition: { pro: 1, po: 3 }, roles: { pro: ['Manager'], po: ['Clerk'] } }
    
    // 1. Separate employees by eligible roles
    // For simplicity in this demo, we will use a naive mapping or just shuffle everyone if no roles specified
    // Ideally we filter `employees` based on `config.roles`
    
    // Shuffle helper
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
    
    let pool = shuffle(employees);
    const teams = [];
    const teamSize = config.composition.pro + config.composition.po;
    
    // Simple allocation for demo: Just grab chunks of employees
    // In real app, we would strictly match designations
    
    for (let i = 0; i < config.totalTeams; i++) {
        if (pool.length < teamSize) break; // Not enough staff
        
        const teamMembers = pool.splice(0, teamSize);
        teams.push({
            id: `TEAM-${i+1}`,
            name: `Polling Party ${i+1}`,
            members: teamMembers,
            stationId: `PS-${i+1}`
        });
    }

    set({ teams, reserves: pool, hasGenerated: true }, false, "generateTeams");
    return { created: teams.length, reserves: pool.length };
  },

  disbandTeams: () => set({ teams: [], reserves: [], hasGenerated: false }, false, "disbandTeams"),
  
  replaceMember: (teamId, memberId, newMember) => set((state) => ({
     teams: state.teams.map(team => 
        team.id === teamId 
            ? { ...team, members: team.members.map(m => m.id === memberId ? newMember : m) }
            : team
     ),
     // Remove newMember from reserves if they came from there
     reserves: state.reserves.filter(r => r.id !== newMember.id) 
  }), false, "replaceMember"),

});

export const useTeamStore = create(
  persist(devtools(teamStore), {
    name: "team-storage",
    storage: createJSONStorage(() => localStorage),
  })
);
