import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Angkatan {
  id: number;
  nama: string;
  tahun: string;
}

export default function FormTambahKelompok() {
  const [kode, setKode] = useState("");
  const [namaKelompok, setNamaKelompok] = useState("");
  const [angkatanId, setAngkatanId] = useState("");
  const [angkatanList, setAngkatanList] = useState<Angkatan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAngkatan = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/api/angkatan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAngkatanList(res.data.data);
      } catch (error) {
        Swal.fire("Gagal", "Gagal memuat data angkatan", "error");
      }
    };

    fetchAngkatan();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/kelompok",
        {
          kode,
          nama_kelompok: namaKelompok,
          angkatan_id: angkatanId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Berhasil", "Kelompok berhasil dibuat", "success").then(() => {
        navigate(`/kelompok-pengguna/${res.data.data.id}`);
      });
    } catch (error) {
      Swal.fire("Gagal", "Gagal menyimpan kelompok", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Tambah Kelompok</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Kode Kelompok</label>
          <input
            type="text"
            placeholder="Contoh: KLP001"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Nama Kelompok</label>
          <input
            type="text"
            placeholder="Nama Kelompok"
            value={namaKelompok}
            onChange={(e) => setNamaKelompok(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Angkatan</label>
          <select
            value={angkatanId}
            onChange={(e) => setAngkatanId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Pilih Angkatan --</option>
            {angkatanList.map((angkatan) => (
              <option key={angkatan.id} value={angkatan.id}>
                {angkatan.nama} - {angkatan.tahun}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan & Lanjutkan
        </button>
      </form>
    </div>
  );
}
