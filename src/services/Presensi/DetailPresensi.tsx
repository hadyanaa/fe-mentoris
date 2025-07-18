import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface PresensiDetailData {
  materi: string;
  keterangan: string;
  tanggal: string;
  jenis_pertemuan: string;
}

export default function PresensiDetail() {
  const [searchParams] = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const navigate = useNavigate();

  const [data, setData] = useState<PresensiDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Anda belum login.");
      setLoading(false);
      return;
    }

    if (tanggal) {
      axios
        .get(`http://localhost:8000/api/presensi/detail?tanggal=${tanggal}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data && res.data.success) {
            setData(res.data.data);
          } else {
            setError("Data tidak ditemukan");
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            setError("Unauthorized: Silakan login kembali.");
          } else {
            setError("Gagal memuat data");
          }
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setError("Tanggal tidak valid");
      setLoading(false);
    }
  }, [tanggal]);

  if (loading) return <p className="p-6 text-gray-600 italic">Memuat data...</p>;
  if (error) return <p className="p-6 text-red-500 font-semibold">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        ← Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Detail Presensi - {tanggal}
      </h1>

      <div className="bg-white rounded shadow p-6 space-y-4 border">
        <div>
          <p className="text-sm text-gray-500">Materi</p>
          <p className="text-lg font-medium text-gray-800">
            {data?.materi || "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Jenis Pertemuan</p>
          <p className="text-base text-gray-700">
            {data?.jenis_pertemuan || "-"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Keterangan Materi:</h2>
        <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-800 leading-relaxed whitespace-pre-line">
          {data?.keterangan || "-"}
        </div>
      </div>
    </div>
  );
}
