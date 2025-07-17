import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GlobalState {
  count: number
  token: string | null
  increment: () => void
  decrement: () => void
  setToken: (token: string) => void
}

export const useGlobalStore = create(persist<GlobalState>(
  (set) => ({
    count: 0,
    token: null,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    setToken: (token) => set({ token }),
    }),
    {
      name: 'global-storage', // localStorage key
    }
  )
)
