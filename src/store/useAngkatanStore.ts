import { create } from 'zustand'
import axios from 'axios'
import { useGlobalStore } from './useGlobalStore'

export type Angkatan = {
  id: number
  nama: string
}

type AngkatanStore = {
  data: Angkatan[]
  loading: boolean
  error: string | null

  fetchAngkatan: () => Promise<void>
  fetchAngkatanById: (id:any) => Promise<void>
  addAngkatan: (payload: Omit<Angkatan, 'id'>) => Promise<void>
  updateAngkatan: (id: number|string, payload: Partial<Angkatan>) => Promise<void>
  deleteAngkatan: (id: number) => Promise<void>
}

export const useAngkatanStore = create<AngkatanStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchAngkatan: async () => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get('http://localhost:8000/api/angkatan', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      }) // Ganti dengan endpoint kamu
      set({ data: res.data.data })
    } catch (err) {
      set({ error: 'Gagal mengambil data Angkatan' })
    } finally {
      set({ loading: false })
    }
  },

  fetchAngkatanById: async (id: string | number) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/angkatan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (err) {
      console.error("Gagal ambil Angkatan by id", err)
      return null
    } finally {
      set({ loading: false })
    }
  },

  addAngkatan: async (payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/angkatan', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      set((state) => ({ data: [...state.data, res.data] }))
    } catch (err) {
      set({ error: 'Gagal menambah data Angkatan' })
    } finally {
      set({ loading: false })
    }
  },

  updateAngkatan: async (id, payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/angkatan/${id}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      set((state) => ({
        data: state.data.map((item) =>
          item.id === id ? { ...item, ...payload } : item
        ),
      }))
    } catch (err) {
      set({ error: 'Gagal memperbarui data Angkatan' })
    } finally {
      set({ loading: false })
    }
  },

  deleteAngkatan: async (id) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/angkatan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },})
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }))
    } catch (err) {
      set({ error: 'Gagal menghapus data Angkatan' })
    } finally {
      set({ loading: false })
    }
  },
}))
