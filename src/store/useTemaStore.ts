import { create } from 'zustand'
import axios from 'axios'
import { useGlobalStore } from './useGlobalStore'

export type Tema = {
  id: number
  nama: string
}

type TemaStore = {
  data: Tema[]
  loading: boolean
  error: string | null

  fetchTema: () => Promise<void>
  fetchTemaById: (id:any) => Promise<void>
  addTema: (payload: Omit<Tema, 'id'>) => Promise<void>
  updateTema: (id: number|string, payload: Partial<Tema>) => Promise<void>
  deleteTema: (id: number) => Promise<void>
}

export const useTemaStore = create<TemaStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchTema: async () => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get('http://localhost:8000/api/tema', {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      }) // Ganti dengan endpoint kamu
      set({ data: res.data.data })
    } catch (err) {
      set({ error: 'Gagal mengambil data Tema' })
    } finally {
      set({ loading: false })
    }
  },

  fetchTemaById: async (id: string | number) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/tema/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data
    } catch (err) {
      console.error("Gagal ambil Tema by id", err)
      return null
    } finally {
      set({ loading: false })
    }
  },

  addTema: async (payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/tema', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      set((state) => ({ data: [...state.data, res.data] }))
    } catch (err) {
      set({ error: 'Gagal menambah data Tema' })
    } finally {
      set({ loading: false })
    }
  },

  updateTema: async (id, payload) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;

    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/tema/${id}`, payload, {
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
      set({ error: 'Gagal memperbarui data Tema' })
    } finally {
      set({ loading: false })
    }
  },

  deleteTema: async (id) => {
    set({ loading: true, error: null })
    const token = useGlobalStore.getState().token;
    if (!token) {
      set({ error: "Token tidak tersedia. Silakan login terlebih dahulu."});
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/tema/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },})
      set((state) => ({
        data: state.data.filter((item) => item.id !== id),
      }))
    } catch (err) {
      set({ error: 'Gagal menghapus data Tema' })
    } finally {
      set({ loading: false })
    }
  },
}))
