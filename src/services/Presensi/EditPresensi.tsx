import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Mentee {
  kelompok_pengguna_id: number;
  nama: string;
  status: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EditPresensi() {
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();

  const tanggalParam = query.get("tanggal");
  const [tanggal, setTanggal] = useState<string>(
    tanggalParam || new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [materi, setMateri] = useState("");
  const [jenisPertemuan, setJenisPertemuan] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!id || !tanggal) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/presensi/${id}?tanggal=${tanggal}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data;
        if (data.length > 0) {
          setMateri(data[0].materi || "");
          setJenisPertemuan(data[0].jenis_pertemuan || "");
          setKeterangan(data[0].keterangan || "");

          const formatted = data.map((item: any) => ({
            kelompok_pengguna_id: item.kelompok_pengguna_id,
            nama: item.nama,
            status: item.status || "hadir",
          }));

          setMentees(formatted);
        }

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setError("Gagal memuat data presensi.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, tanggal]);

  const handleSubmit = async () => {
    if (!tanggal || !materi || !jenisPertemuan) {
      Swal.fire({
        icon: "warning",
        title: "Form tidak lengkap",
        text: "Semua field wajib diisi.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const payload = mentees.map((mentee) => ({
      kelompok_pengguna_id: mentee.kelompok_pengguna_id,
      tanggal,
      materi,
      keterangan,
      jenis_pertemuan: jenisPertemuan,
      status: mentee.status,
    }));

    Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:8000/api/presensi", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Presensi berhasil diperbarui.",
          }).then(() => {
            navigate(`/presensi/kelompok/${id}`);
          });
        } catch (err) {
          console.error("Gagal submit presensi:", err);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menyimpan presensi.",
          });
        }
      }
    });
  };

  if (loading) return <div className="p-6">Memuat data presensi...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Edit Presensi</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal</label>
          <DatePicker
            selected={tanggal ? new Date(tanggal) : null}
            onChange={(date: Date | null) => {
              if (date) setTanggal(date.toISOString().split("T")[0]);
            }}
            dateFormat="yyyy-MM-dd"
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jenis Pertemuan</label>
          <select
            value={jenisPertemuan}
            onChange={(e) => setJenisPertemuan(e.target.value)}
            className="w-full border p-2 rounded"
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

      <div>
        <label className="block text-sm font-medium mb-1">Keterangan</label>
        <textarea
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border p-3 rounded min-h-[90px]"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 mt-4">Daftar Mentee:</h3>
        <table className="w-full border border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama Mentee</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={index}>
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
                    className="w-full border p-1 rounded"
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
          Update Presensi
        </button>
      </div>
    </div>
  );
}
