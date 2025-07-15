import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Angkatan {
  id: number;
  nama: string;
  tahun: string;
}

interface Kelompok {
  id: number;
  nama: string;
  angkatan: {
    nama: string;
    tahun: string;
  };
  pivot?: {
    peran: string;
  };
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

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (user.role === "super admin" || user.role === "admin") {
      axios.get("http://localhost:8000/api/angkatan", { headers })
        .then(res => setAngkatanList(res.data.data))
        .catch(err => console.error("Gagal ambil angkatan:", err));
    }

    if (user.role === "mentor") {
      axios.get("http://localhost:8000/api/kelompok", { headers })
        .then(res => setKelompokList(res.data.data))
        .catch(err => console.error("Gagal ambil kelompok:", err));
    }
  }, []);

  const goToKelompok = (angkatanId: number) => {
    navigate(`/kelompok/angkatan/${angkatanId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Daftar Presensi</h2>

      {role === "super admin" || role === "admin" ? (
        <>
          <h3 className="text-lg font-medium mb-3">Angkatan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {angkatanList.map((angkatan) => (
              <div
                key={angkatan.id}
                onClick={() => goToKelompok(angkatan.id)}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    Angkatan {angkatan.nama}
                  </h4>
                </div>
                <p className="text-sm text-gray-500">Klik untuk lihat kelompok</p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {role === "mentor" && (
        <>
          <h3 className="text-lg font-medium mb-3">Kelompok Anda (Sebagai Mentor / Mentee)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {kelompokList.map((kelompok) => {
              const peran = kelompok?.pivot?.peran || "tidak terbaca"; // fallback

              return (
                <div
                  key={kelompok.id}
                  className="border rounded p-4 shadow bg-white"
                >
                  <h4 className="font-bold text-green-600">{kelompok.nama}</h4>
                  <p className="text-sm text-gray-500">
                    Angkatan: {kelompok.angkatan?.nama || "-"} ({kelompok.angkatan?.tahun || "-"})
                  </p>
                  <p className="text-sm mt-1 text-gray-400 italic">
                    Peran: {peran}
                  </p>

                  <button
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() =>
                      peran === "mentor"
                        ? navigate(`/presensi/kelompok/${kelompok.id}`) // proses presensi
                        : navigate(`/rekapan/presensi/${kelompok.id}`) // lihat rekap presensi
                    }
                  >
                    {peran === "mentor" ? "Isi Presensi" : "Lihat Rekapan"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
