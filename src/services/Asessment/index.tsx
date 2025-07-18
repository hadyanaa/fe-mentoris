// src/pages/AssessmentIndex.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Jenjang {
  id: number;
  nama_jenjang: string;
}

export default function AssessmentIndex() {
  const [role, setRole] = useState<string>("");
  const [jenjangList, setJenjangList] = useState<Jenjang[]>([]);
  const [periode, setPeriode] = useState<string>("ganjil");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userString);
    const headers = { Authorization: `Bearer ${token}` };

    setRole(user.role);

    const fetchData = async () => {
      try {
        if (user.role === "admin" || user.role === "super admin") {
          const jenjangRes = await axios.get("http://localhost:8000/api/jenjang", { headers });
          setJenjangList(jenjangRes.data.data);

          const savedPeriode = localStorage.getItem("periode") || "ganjil";
          setPeriode(savedPeriode);
        } else if (user.role === "mentor" || user.role === "mentee") {
          const profileRes = await axios.get("http://localhost:8000/api/profile", { headers });
          const pengguna = profileRes.data.data.pengguna;

          if (pengguna?.jenjang_id && pengguna?.jenjang) {
            setJenjangList([
              {
                id: pengguna.jenjang_id,
                nama_jenjang: pengguna.jenjang.nama_jenjang || "Nama jenjang tidak tersedia",
              },
            ]);
          } else {
            setErrorMsg("Jenjang belum ditentukan. Silakan hubungi admin.");
            return;
          }

          const periodeRes = await axios.get("http://localhost:8000/api/periode-aktif", { headers });
          setPeriode(periodeRes.data.periode || "ganjil");
        }
      } catch (error) {
        setErrorMsg("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const goToPertanyaan = (jenjangId: number) => {
    navigate(`/assessment/jenjang/${jenjangId}?periode=${periode}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Assessment</h2>


      {loading ? (
        <p>Memuat data...</p>
      ) : errorMsg ? (
        <p className="text-red-600">{errorMsg}</p>
      ) : (
        <>
          {(role === "admin" || role === "super admin") && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Pilih Periode:
              </label>
              <select
                value={periode}
                onChange={(e) => {
                  const selected = e.target.value;
                  setPeriode(selected);
                  localStorage.setItem("periode", selected);
                }}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="ganjil">Ganjil</option>
                <option value="genap">Genap</option>
              </select>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Jenjang</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {jenjangList.map((jenjang) => (
              <div
                key={jenjang.id}
                onClick={() => goToPertanyaan(jenjang.id)}
                className="cursor-pointer bg-white border rounded-xl p-5 shadow hover:shadow-md transition hover:border-blue-500"
              >
                {(role === "admin" || role === "super admin") && (
                  <h4 className="text-lg font-bold text-blue-600 mb-2">
                    {jenjang.nama_jenjang}
                  </h4>
                )}
                {(role === "mentor" || role === "mentee") && (
                  <h4 className="text-lg font-bold text-blue-600 mb-1">Isi Assessment</h4>
                )}
                <p className="text-sm text-gray-500">Klik untuk lihat pertanyaan</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
