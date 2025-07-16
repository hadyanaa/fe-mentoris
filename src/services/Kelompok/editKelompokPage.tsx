import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Angkatan {
  id: number;
  nama: string;
  tahun: string;
}

export default function EditKelompokPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [kode, setKode] = useState("");
  const [namaKelompok, setNamaKelompok] = useState("");
  const [angkatanId, setAngkatanId] = useState<number | null>(null);
  const [angkatanList, setAngkatanList] = useState<Angkatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch data kelompok (edit)
    axios.get(`http://localhost:8000/api/kelompok/${id}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data.data;
      setKode(data.kode || "");
      setNamaKelompok(data.nama_kelompok);
      setAngkatanId(data.angkatan_id); // penting!
    })
    .catch((err) => {
      console.error("Gagal ambil data kelompok:", err);
      setError("Gagal memuat data kelompok.");
    });

    // Fetch data angkatan
    axios.get("http://localhost:8000/api/angkatan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.data.success) {
        setAngkatanList(res.data.data);
      }
    })
    .catch((err) => {
      console.error("Gagal ambil data angkatan:", err);
    })
    .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8000/api/kelompok/${id}`,
        {
          kode,
          nama_kelompok: namaKelompok,
          angkatan_id: angkatanId, // wajib dikirimkan!
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Berhasil memperbarui data kelompok!");
      navigate(-1);
    } catch (err) {
      console.error("Gagal update kelompok:", err);
      setError("Gagal memperbarui data. Silakan coba lagi.");
    }
  };

  if (loading) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Kelompok</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Kode Kelompok</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nama Kelompok</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={namaKelompok}
            onChange={(e) => setNamaKelompok(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Angkatan</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={angkatanId ?? ""}
            onChange={(e) => setAngkatanId(Number(e.target.value))}
            required
          >
            <option value="">Pilih Angkatan</option>
            {angkatanList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nama} - {a.tahun}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
