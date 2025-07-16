import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user?.nama_lengkap || "Pengguna");
    setUserRole(user?.role || "");

    if (!user?.role) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-8 max-w-4xl mx-auto text-center bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Selamat Datang, {userName}!
      </h1>
      <p className="text-gray-600 text-lg">
        Anda login sebagai <span className="font-semibold text-green-600">{userRole.toUpperCase()}</span>
      </p>
      <p className="mt-4 text-gray-500">
        Ini adalah halaman dashboard utama aplikasi <strong>BKPK</strong>.
      </p>

      {/* Tombol Aksi Khusus Role */}
      {userRole === "mentor" || userRole === "mentee" ? (
        <button
          onClick={() => navigate("/presensi")}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Cek Presensi
        </button>
      ) : (
        <button
          onClick={() => navigate("/presensi")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Kelola Kelompok
        </button>
      )}
    </div>
  );
}
