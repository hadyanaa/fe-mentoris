import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa";

export default function Home() {
 const [userName, setUserName] = useState("Pengguna");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "Pengguna");
      
      } catch (err) {
        console.error("Gagal parse data user:", err);
      }
    }
  }, []);

  const handlePresensi = () => {
    navigate("/presensi");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-3">
          Selamat Datang, {userName} 👋
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          di Aplikasi <span className="font-semibold text-blue-600">BKPK</span> — Bidang Kaderisasi dan Pengembangan Karakter
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            Silakan akses fitur presensi untuk memulai aktivitas mentoring Anda.
          </p>
        </div>

        <button
          onClick={handlePresensi}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300"
        >
          <FaUserCheck className="text-xl" />
          Cek Presensi
        </button>
      </div>
    </div>
  );
}
