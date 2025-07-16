import { useEffect, useState } from "react";
import axios from "axios";

interface Mentee {
  kelompok_pengguna_id: number;
  nama: string;
  status: string; // enum: hadir, alfa, sakit, izin
}

export default function PresensiMentorTable() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [namaKelompok, setNamaKelompok] = useState<string>("-");
  const [namaMentor, setNamaMentor] = useState<string>("-");
  const [materi, setMateri] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kelompokId, setKelompokId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/presensi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;

        if (data.length > 0) {
          setNamaKelompok(data[0]?.kelompok || "-");
          setKelompokId(data[0]?.kelompok_id ?? null);
          setNamaMentor(res.data.user?.nama || "-");

          const formatted = data.map((item: any) => ({
            kelompok_pengguna_id: item.kelompok_pengguna_id,
            nama: item.nama,
            status: item.status ?? "hadir",
          }));

          setMentees(formatted);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data presensi:", err);
        setError("Gagal memuat data presensi mentee");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!tanggal) {
      alert("Tanggal wajib diisi.");
      return;
    }
    if (!materi) {
      alert("Materi wajib diisi.");
      return;
    }
    if (!kelompokId) {
      alert("Kelompok tidak ditemukan. Pastikan data berhasil dimuat.");
      return;
    }

    try {
      const payload = mentees.map((mentee) => ({
        kelompok_pengguna_id: mentee.kelompok_pengguna_id,
        tanggal,
        materi,
        keterangan,
        status: mentee.status,
      }));

      await axios.post("http://localhost:8000/api/presensi", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Presensi berhasil disimpan.");
    } catch (err) {
      console.error("Gagal submit presensi:", err);
      alert("Gagal menyimpan presensi.");
    }
  };

  if (loading) return <div className="p-6">Memuat data presensi...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Presensi Hari Ini</h2>

      <div className="space-y-2">
        <p>
          <strong>Nama Kelompok:</strong> {namaKelompok}
        </p>
        <p>
          <strong>Nama Mentor:</strong> {namaMentor}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Materi</label>
          <input
            type="text"
            value={materi}
            onChange={(e) => setMateri(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Judul materi"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Keterangan (optional)</label>
          <textarea
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full border p-2 rounded min-h-[80px]"
            placeholder="Catatan atau deskripsi"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 mt-4">Daftar Mentee:</h3>
        <table className="w-full border border-collapse rounded text-sm mx-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border w-12">No</th>
              <th className="p-2 border text-center">Nama Mentee</th>
              <th className="p-2 border w-48">Status</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border text-center">{mentee.nama}</td>
                <td className="p-2 border">
                  <select
                    value={mentee.status}
                    onChange={(e) => {
                      const updated = [...mentees];
                      updated[index].status = e.target.value;
                      setMentees(updated);
                    }}
                    className="border p-1 rounded w-full"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="alfa">Alfa</option>
                    <option value="sakit">Sakit</option>
                    <option value="izin">Izin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Simpan Presensi
        </button>
      </div>
    </div>
  );
}
