import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // UI
  openSection: null,
  setOpenSection: (s) => set({ openSection: s }),
  closeSection: () => set({ openSection: null }),

  terminalOpen: false,
  setTerminalOpen: (v) => set({ terminalOpen: v }),

  isAdmin: false,
  setAdmin: (v) => set({ isAdmin: v }),

  mobileMode: false,
  setMobileMode: (v) => set({ mobileMode: v }),

  // Camera target for smooth transitions
  cameraTarget: null,
  setCameraTarget: (t) => set({ cameraTarget: t }),

  // Portfolio data (from API)
  profile: null,
  skills: [],
  projects: [],
  timeline: [],
  setProfile: (p) => set({ profile: p }),
  setSkills: (s) => set({ skills: s }),
  setProjects: (p) => set({ projects: p }),
  setTimeline: (t) => set({ timeline: t }),

  // Admin code (after terminal auth)
  adminCode: '0000',
  setAdminCode: (c) => set({ adminCode: c }),
  adminToken: null,
  setAdminToken: (t) => set({ adminToken: t }),
}))
