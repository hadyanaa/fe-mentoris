import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

interface Pengguna {
  id: number;
  nama_lengkap: string;
}

interface FormEntry {
  pengguna_id: number;
  peran: string;
}

export default function FormTambahKelompokPengguna() {
  const { id: kelompokId } = useParams();
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>([]);
  const [menteeIds, setMenteeIds] = useState<number[]>([]);
  const [formEntries, setFormEntries] = useState<FormEntry[]>([
    { pengguna_id: 0, peran: "mentee" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Ambil semua pengguna
    axios
      .get("http://localhost:8000/api/pengguna", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPenggunaList(res.data.data))
      .catch(() => Swal.fire("Gagal", "Gagal mengambil data pengguna", "error"));

    // Ambil pengguna yang sudah jadi mentee
    axios
      .get("http://localhost:8000/api/pengguna-mentee", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = res.data.data.map((item: { pengguna_id: number }) => item.pengguna_id);
        setMenteeIds(ids);
      })
      .catch(() => Swal.fire("Gagal", "Gagal mengambil data mentee", "error"));
  }, []);

  const handleEntryChange = (index: number, field: keyof FormEntry, value: string | number) => {
    const updated = [...formEntries];
    updated[index][field] = field === "pengguna_id" ? Number(value) : value;
    setFormEntries(updated);
  };

  const addEntry = () => {
    setFormEntries([...formEntries, { pengguna_id: 0, peran: "mentee" }]);
  };

  const removeEntry = (index: number) => {
    const updated = [...formEntries];
    updated.splice(index, 1);
    setFormEntries(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = formEntries.some((entry) => entry.pengguna_id === 0);
    if (invalid) {
      Swal.fire("Oops", "Semua pengguna harus dipilih", "warning");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/kelompok-pengguna",
        {
          kelompok_id: kelompokId,
          pengguna: formEntries,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Berhasil", "Pengguna ditambahkan ke kelompok", "success").then(() =>
        navigate(`/presensi/kelompok/${kelompokId}`)
      );
    } catch {
      Swal.fire("Gagal", "Gagal menyimpan data", "error");
    }
  };

  const filteredPengguna = penggunaList
    .filter((user) => !menteeIds.includes(user.id)) // ⛔ filter yang sudah jadi mentee
    .filter((user) =>
      user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Tambah Pengguna ke Kelompok
      </h2>

      {/* 🔍 Input Pencarian */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari pengguna berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {formEntries.map((entry, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-center gap-4 mb-4 border-b pb-4"
        >
          <div className="flex-1 w-full">
            <label className="text-sm font-medium block mb-1">Pengguna</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={entry.pengguna_id}
              onChange={(e) => handleEntryChange(index, "pengguna_id", e.target.value)}
              required
            >
              <option value={0} disabled>
                -- Pilih Pengguna --
              </option>
              {filteredPengguna.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-40">
            <label className="text-sm font-medium block mb-1">Peran</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={entry.peran}
              onChange={(e) => handleEntryChange(index, "peran", e.target.value)}
            >
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          </div>

          {formEntries.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="text-red-600 hover:underline text-sm mt-6 sm:mt-0"
            >
              Hapus
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="mb-6 text-blue-600 hover:underline text-sm"
      >
        + Tambah Pengguna Lain
      </button>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Simpan ke Kelompok
      </button>
    </form>
  );
}
