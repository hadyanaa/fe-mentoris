import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // gunakan untuk notifikasi

interface Angkatan {
  id: number;
  nama: string;
  tahun: string;
}

interface Kelompok {
  kelompok_id: number;
  nama_kelompok: string;
  peran: string;
}

export default function PresensiIndex() {
  const [role, setRole] = useState<string>("");
  const [angkatanList, setAngkatanList] = useState<Angkatan[]>([]);
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(user.role);

    const headers = { Authorization: `Bearer ${token}` };

    if (user.role === "super admin" || user.role === "admin") {
      axios
        .get("http://localhost:8000/api/angkatan", { headers })
        .then((res) => setAngkatanList(res.data.data))
        .catch((err) => console.error("Gagal ambil angkatan:", err));
    }

    if (user.role === "mentor" || user.role === "mentee") {
      axios
        .get("http://localhost:8000/api/kelompok", { headers })
        .then((res) => {
          const { mentor = [], mentee = [] } = res.data.data;
          setKelompokList([...mentor, ...mentee]);
        })
        .catch((err) => console.error("Gagal ambil kelompok:", err));
    }
  }, []);

  const goToKelompok = (angkatanId: number) => {
    navigate(`/kelompok/angkatan/${angkatanId}`);
  };

  // Ganti nama fungsi dan tipe file yang diizinkan
const handleImportExcel = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file); // key 'file' disesuaikan dengan backend

  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(
      "http://localhost:8000/api/import-pengguna",
      formData,
      { headers }
    );

    Swal.fire("Berhasil", response.data.message || "Import berhasil", "success");
  } catch (error: any) {
    console.error("Gagal import:", error);
    Swal.fire("Gagal", "Import gagal. Pastikan format file Excel/CSV valid.", "error");
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Daftar Presensi</h2>

      {(role === "super admin" || role === "admin") && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pilih Angkatan</h3>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/kelompok/tambah")}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                + Tambah Kelompok
              </button>
              <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                📁 Import Excel
              <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImportExcel} // gunakan fungsi baru
                  hidden
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {angkatanList.map((angkatan) => (
              <div
                key={angkatan.id}
                onClick={() => goToKelompok(angkatan.id)}
                className="cursor-pointer bg-white border rounded-xl p-5 shadow hover:shadow-md transition-all hover:border-blue-500"
              >
                <h4 className="text-lg font-bold text-blue-600 mb-1">
                  Angkatan {angkatan.nama}
                </h4>
                <p className="text-sm text-gray-500">Tahun: {angkatan.tahun}</p>
                <p className="text-xs text-gray-400 mt-2">Klik untuk lihat kelompok</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MENTOR/MENTEE */}
   {(role === "mentor" || role === "mentee") && (
  <>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kelompok Anda</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {kelompokList.map((kelompok) => (
        <div
          key={kelompok.kelompok_id}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition"
        >
          <div className="mb-2">
            <h4 className="text-lg font-bold text-green-700">
              {kelompok.nama_kelompok}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Peran: <span className="italic">{kelompok.peran}</span>
            </p>
          </div>

          {/* Tombol aksi */}
          {kelompok.peran === "mentor" ? (
            <div className="flex gap-2 mt-3">
              <button
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => navigate(`/presensi/preview/${kelompok.kelompok_id}`)}
              >
                Isi Presensi
              </button>
             <button
      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
      onClick={() => navigate(`/presensi/kelompok/${kelompok.kelompok_id}`)} // diarahkan ke route yang kamu inginkan
    >
      Rekapan
    </button>
            </div>
          ) : (
            <button
              className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              onClick={() => navigate(`/rekap-presensi-mentee`)}
            >
              Lihat Rekapan
            </button>
          )}
        </div>
      ))}
    </div>
  </>
)}
    </div>
  );
}
