import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";



interface Kelompok {
  id: number;
  nama_kelompok: string;
}

interface Pengguna {
  id: number;
  nama_lengkap: string;
  peran: string; // Ganti dari 'role'
}

interface SelectedPengguna {
  id: number;
  peran: string; // Ganti dari 'role'
}

export default function PindahKelompokMentee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const kelompokId = id ? parseInt(id) : 0;

  const [penggunaList, setPenggunaList] = useState<Pengguna[]>([]);
  const [selectedPengguna, setSelectedPengguna] = useState<SelectedPengguna[]>([]);
  const [daftarKelompok, setDaftarKelompok] = useState<Kelompok[]>([]);
  const [kelompokBaru, setKelompokBaru] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !kelompokId) return;

    axios
      .get(`http://localhost:8000/api/kelompok-pengguna/${kelompokId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data: Pengguna[] = res.data.data;
        setPenggunaList(data);
        setSelectedPengguna(data.map((p) => ({ id: p.id, peran: p.peran })));
      })
      .catch(() => {
        Swal.fire("Gagal", "Gagal mengambil data pengguna", "error");
      });

    axios
      .get("http://localhost:8000/api/kelompok-pengguna", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const rawData: Kelompok[] = res.data.data;
        setDaftarKelompok(rawData);
      })
      .catch(() => {
        Swal.fire("Gagal", "Gagal mengambil daftar kelompok", "error");
      });
  }, [kelompokId]);

  const handleCheckboxChange = (pengguna: Pengguna, checked: boolean) => {
    setSelectedPengguna((prev) =>
      checked
        ? [...prev, { id: pengguna.id, peran: pengguna.peran }]
        : prev.filter((p) => p.id !== pengguna.id)
    );
  };

  const handlePeranChange = (id: number, newPeran: string) => {
    setSelectedPengguna((prev) =>
      prev.map((p) => (p.id === id ? { ...p, peran: newPeran } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (kelompokBaru === 0 || selectedPengguna.length === 0) {
      Swal.fire("Gagal", "Lengkapi pilihan kelompok dan pengguna", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/kelompok-pengguna/${kelompokId}`,
        {
          kelompok_id_baru: kelompokBaru,
          pengguna_ids: selectedPengguna.map((p) => p.id),
          peran: selectedPengguna.map((p) => p.peran),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Berhasil", "Pengguna berhasil dipindahkan", "success").then(() => {
      navigate(`/presensi/kelompok/${kelompokBaru}`);
      });
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat memindahkan pengguna", "error");
    }
  };

  const filteredPengguna = penggunaList.filter((p) =>
    p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow rounded max-w-4xl mx-auto">
   <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-gray-800">
    Pindahkan Pengguna ke Kelompok Lain
  </h2>
  <button
    onClick={() => navigate(`/kelompok-pengguna/${kelompokId}`)}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
  >
    + Tambah Anggota
  </button>
</div>


      <form onSubmit={handleSubmit}>
        {/* Kelompok Tujuan */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-gray-700">
            Kelompok Tujuan
          </label>
          <select
            value={kelompokBaru}
            onChange={(e) => setKelompokBaru(parseInt(e.target.value))}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">-- Pilih Kelompok --</option>
            {daftarKelompok
              .filter((k) => k.id !== kelompokId)
              .map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kelompok}
                </option>
              ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>

        {/* Daftar Pengguna */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Daftar Pengguna
          </label>
          <div className="border rounded p-3 max-h-96 overflow-y-auto">
            {filteredPengguna.length > 0 ? (
              filteredPengguna.map((pengguna) => {
                const isChecked = selectedPengguna.some(
                  (p) => p.id === pengguna.id
                );
                const currentPeran =
                  selectedPengguna.find((p) => p.id === pengguna.id)?.peran || "";

                return (
                  <div
                    key={pengguna.id}
                    className="flex items-center justify-between mb-3"
                  >
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleCheckboxChange(pengguna, e.target.checked)
                        }
                      />
                      <span>{pengguna.nama_lengkap}</span>
                    </label>
                    {isChecked && (
                      <select
                        value={currentPeran}
                        onChange={(e) =>
                          handlePeranChange(pengguna.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="mentee">Mentee</option>
                        <option value="mentor">Mentor</option>
                      </select>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Tidak ada pengguna ditemukan.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
            Pindahkan Anggota
        </button>
     
      </form>
    </div>
  );
}
