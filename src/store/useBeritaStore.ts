import { create } from 'zustand'
import axios from 'axios'
import { useGlobalStore } from './useGlobalStore'

export type Berita = {
  id: number
  judul: string
  sumber: string
  konten_berita: string
}

type BeritaStore = {
  data: Berita[]
  loading: boolean
  error: string | null

  fetchBerita: () => Promise<void>
  fetchBeritaById: (id:any) => Promise<void>
  addBerita: (payload: Omit<Berita, 'id'>) => Promise<void>
  updateBerita: (id: number|string, payload: Partial<Berita>) => Promise<void>
  deleteBerita: (id: number) => Promise<void>
}

export const useBeritaStore = create<BeritaStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchBerita: async () => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get('http://localhost:8000/api/berita', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      }) // Ganti dengan endpoint kamu
      set({ data: res.data.data })
    } catch (err) {
      set({ error: 'Gagal mengambil data Berita' })
    } finally {
      set({ loading: false })
    }
  },

  fetchBeritaById: async (id: string | number) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/berita/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (err) {
      console.error("Gagal ambil berita by id", err)
      return null
    } finally {
      set({ loading: false })
    }
  },

  addBerita: async (payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/berita', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      set((state) => ({ data: [...state.data, res.data] }))
    } catch (err) {
      set({ error: 'Gagal menambah data berita' })
    } finally {
      set({ loading: false })
    }
  },

  updateBerita: async (id, payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/berita/${id}`, payload, {
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
      set({ error: 'Gagal memperbarui data berita' })
    } finally {
      set({ loading: false })
    }
  },

  deleteBerita: async (id) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/berita/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },})
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }))
    } catch (err) {
      set({ error: 'Gagal menghapus data berita' })
    } finally {
      set({ loading: false })
    }
  },
}))
