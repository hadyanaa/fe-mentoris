import { useEffect, useState } from "react";
import axios from "axios";

interface MateriItem {
  materi: string;
  tanggal: string;
}
interface RekapData {
  nama_lengkap: string;
  mentor: string;
  jumlah_hadir: number;
  jumlah_sakit: number;
  jumlah_alfa: number;
  jumlah_izin: number;
materi_disampaikan: MateriItem[]; 
}

export default function RekapPresensiMentee() {
  const [rekap, setRekap] = useState<RekapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchRekap = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/rekap-presensi-mentee", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRekap(res.data.data);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setErrorMsg("Anda tidak memiliki akses.");
        } else {
          setErrorMsg("Gagal memuat data rekap presensi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRekap();
  }, []);

  if (loading) return <p>Memuat data...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;
  if (!rekap) return <p>Tidak ada data rekap presensi.</p>;

  return (
    <div className="p-6 bg-white rounded shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Rekap Presensi Mentee</h2>

      {/* Informasi Personal dan Rekap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-100 rounded p-4 shadow-sm">
          <p className="text-sm text-gray-600">Nama Lengkap</p>
          <p className="text-lg font-semibold">{rekap.nama_lengkap}</p>
        </div>
        <div className="bg-gray-100 rounded p-4 shadow-sm">
          <p className="text-sm text-gray-600">Nama Mentor</p>
          <p className="text-lg font-semibold">{rekap.mentor}</p>
        </div>
        <div className="bg-green-100 rounded p-4 shadow-sm">
          <p className="text-sm text-green-700">Jumlah Hadir</p>
          <p className="text-xl font-bold text-green-700">{rekap.jumlah_hadir}</p>
        </div>
        <div className="bg-yellow-100 rounded p-4 shadow-sm">
          <p className="text-sm text-yellow-700">Jumlah Sakit</p>
          <p className="text-xl font-bold text-yellow-700">{rekap.jumlah_sakit}</p>
        </div>
        <div className="bg-red-100 rounded p-4 shadow-sm">
          <p className="text-sm text-red-700">Jumlah Alfa</p>
          <p className="text-xl font-bold text-red-700">{rekap.jumlah_alfa}</p>
        </div>
        <div className="bg-blue-100 rounded p-4 shadow-sm">
          <p className="text-sm text-blue-700">Jumlah Izin</p>
          <p className="text-xl font-bold text-blue-700">{rekap.jumlah_izin}</p>
        </div>
      </div>

      {/* Materi Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Materi yang Sudah Disampaikan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="py-2 px-4 border-b">No</th>
                <th className="py-2 px-4 border-b">Materi</th>
                <th className="py-2 px-4 border-b">Tanggal Pelaksanaan</th>
                
              </tr>
            </thead>
            <tbody>
              {rekap.materi_disampaikan.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                 <td className="py-2 px-4 border-b">{item.materi}</td>
                <td className="py-2 px-4 border-b">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
              {rekap.materi_disampaikan.map.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    Belum ada materi yang disampaikan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
