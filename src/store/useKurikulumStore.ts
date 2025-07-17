import { create } from 'zustand'
import axios from 'axios'
import { useGlobalStore } from './useGlobalStore'

export type Kurikulum = {
  id: number
  jenjang_id: number
  judul: string
  deskripsi: string
  urutan: string
}

type KurikulumStore = {
  data: Kurikulum[]
  loading: boolean
  error: string | null

  fetchKurikulum: () => Promise<void>
  fetchKurikulumById: (id:any) => Promise<void>
  addKurikulum: (payload: Omit<Kurikulum, 'id'>) => Promise<void>
  updateKurikulum: (id: number|string, payload: Partial<Kurikulum>) => Promise<void>
  deleteKurikulum: (id: number) => Promise<void>
}

export const useKurikulumStore = create<KurikulumStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchKurikulum: async () => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get('http://localhost:8000/api/kurikulum', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      }) // Ganti dengan endpoint kamu
      set({ data: res.data.data })
    } catch (err) {
      set({ error: 'Gagal mengambil data Kurikulum' })
    } finally {
      set({ loading: false })
    }
  },

  fetchKurikulumById: async (id: string | number) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/kurikulum/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (err) {
      console.error("Gagal ambil Kurikulum by id", err)
      return null
    } finally {
      set({ loading: false })
    }
  },

  addKurikulum: async (payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/kurikulum', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      set((state) => ({ data: [...state.data, res.data] }))
    } catch (err) {
      set({ error: 'Gagal menambah data Kurikulum' })
    } finally {
      set({ loading: false })
    }
  },

  updateKurikulum: async (id, payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/kurikulum/${id}`, payload, {
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
      set({ error: 'Gagal memperbarui data Kurikulum' })
    } finally {
      set({ loading: false })
    }
  },

  deleteKurikulum: async (id) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/kurikulum/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },})
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }))
    } catch (err) {
      set({ error: 'Gagal menghapus data Kurikulum' })
    } finally {
      set({ loading: false })
    }
  },
}))
