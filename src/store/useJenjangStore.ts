import { create } from 'zustand'
import axios from 'axios'
import { useGlobalStore } from './useGlobalStore'

export type Jenjang = {
  id: number
  nama_jenjang: string
  deskripsi: string
}

type JenjangStore = {
  data: Jenjang[]
  loading: boolean
  error: string | null

  fetchJenjang: () => Promise<void>
  fetchJenjangById: (id:any) => Promise<void>
  addJenjang: (payload: Omit<Jenjang, 'id'>) => Promise<void>
  updateJenjang: (id: number|string, payload: Partial<Jenjang>) => Promise<void>
  deleteJenjang: (id: number) => Promise<void>
}

export const useJenjangStore = create<JenjangStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchJenjang: async () => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    console.log(token);

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get('http://localhost:8000/api/jenjang', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      }) // Ganti dengan endpoint kamu
      set({ data: res.data.data })
    } catch (err) {
      set({ error: 'Gagal mengambil data jenjang' })
    } finally {
      set({ loading: false })
    }
  },

  fetchJenjangById: async (id: string | number) => {
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/jenjang/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (err) {
      console.error("Gagal ambil jenjang by id", err)
      return null
    }
  },

  addJenjang: async (payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/jenjang', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      set((state) => ({ data: [...state.data, res.data] }))
    } catch (err) {
      set({ error: 'Gagal menambah data jenjang' })
    }
  },

  updateJenjang: async (id, payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/jenjang/${id}`, payload, {
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
      set({ error: 'Gagal memperbarui data jenjang' })
    }
  },

  deleteJenjang: async (id) => {
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/jenjang/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },})
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }))
    } catch (err) {
      set({ error: 'Gagal menghapus data jenjang' })
    }
  },
}))
