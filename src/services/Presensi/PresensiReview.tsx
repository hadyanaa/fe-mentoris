import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
interface Mentee {
  kelompok_pengguna_id: number;
  nama: string;
  status: string; // enum: hadir, alfa, sakit, izin
}

export default function PresensiMentorTable() {
    const navigate = useNavigate(); //
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [namaKelompok, setNamaKelompok] = useState<string>("-");
  const [namaMentor, setNamaMentor] = useState<string>("-");
  const [materi, setMateri] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState<string>("");
  const [jenisPertemuan, setJenisPertemuan] = useState("");
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

  if (!tanggal || !materi || !jenisPertemuan || !kelompokId) {
    Swal.fire({
      icon: "warning",
      title: "Form belum lengkap",
      text: "Semua field wajib diisi.",
    });
    return;
  }

  try {
    const payload = mentees.map((mentee) => ({
      kelompok_pengguna_id: mentee.kelompok_pengguna_id,
      tanggal,
      materi,
      keterangan,
      jenis_pertemuan: jenisPertemuan,
      status: mentee.status,
    }));

    await axios.post("http://localhost:8000/api/presensi", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Presensi berhasil disimpan.",
      confirmButtonText: "OK",
    }).then(() => {
      navigate(`/presensi/kelompok/${kelompokId}`);
    });
  } catch (err) {
    console.error("Gagal submit presensi:", err);
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Gagal menyimpan presensi.",
    });
  }
};

  if (loading) return <div className="p-6">Memuat data presensi...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Presensi Hari Ini</h2>

      <div className="space-y-1 text-sm text-gray-700">
        <p><strong>Nama Kelompok:</strong> {namaKelompok}</p>
        <p><strong>Nama Mentor:</strong> {namaMentor}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal</label>
          <DatePicker
            selected={tanggal ? new Date(tanggal) : null}
            onChange={(date: Date | null) => {
              if (date) setTanggal(date.toISOString().split("T")[0]);
            }}
            dateFormat="yyyy-MM-dd"
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholderText="Pilih tanggal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Materi</label>
          <input
            type="text"
            value={materi}
            onChange={(e) => setMateri(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Judul materi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Jenis Pertemuan</label>
          <select
            value={jenisPertemuan}
            onChange={(e) => setJenisPertemuan(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Pilih jenis pertemuan</option>
            <option value="mentoring">Mentoring</option>
            <option value="JR">JR</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Penugasan">Penugasan</option>
            <option value="Mabit">Mabit</option>
            <option value="Kajian">Kajian</option>
            <option value="Muqoyyam">Muqoyyam</option>
            <option value="Rihlah">Rihlah</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1 text-gray-700">Keterangan (optional)</label>
        <textarea
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[90px]"
          placeholder="Catatan atau deskripsi"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Daftar Mentee:</h3>
        <table className="w-full border border-gray-300 border-collapse rounded text-sm shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama Mentee</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border">{mentee.nama}</td>
                <td className="p-2 border">
                  <select
                    value={mentee.status}
                    onChange={(e) => {
                      const updated = [...mentees];
                      updated[index].status = e.target.value;
                      setMentees(updated);
                    }}
                    className="w-full border border-gray-300 p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
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
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow transition-all"
        >
          Simpan Presensi
        </button>
      </div>
    </div>
  );
}
