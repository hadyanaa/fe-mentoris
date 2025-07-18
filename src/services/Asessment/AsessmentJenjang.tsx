import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

interface Pertanyaan {
  id: number;
  pertanyaan: string;
  bobot: number;
  tema: {
    nama: string;
  };
}

export default function AssessmentByJenjang() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pertanyaanList, setPertanyaanList] = useState<Pertanyaan[]>([]);
  const [groupedByTema, setGroupedByTema] = useState<{ [key: string]: Pertanyaan[] }>({});
  const [temaNames, setTemaNames] = useState<string[]>([]);
  const [currentTemaIndex, setCurrentTemaIndex] = useState<number>(0);
  const [jawaban, setJawaban] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [periode, setPeriode] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  // Ambil role dan periode
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const role = user.role?.toLowerCase();
      setUserRole(role);

      if (role === "mentor" || role === "mentee") {
        axios
          .get("http://localhost:8000/api/periode-aktif")
          .then((res) => {
            setPeriode(res.data.periode);
          })
          .catch(() => {
            setPeriode("ganjil");
          });
      } else {
        const saved = localStorage.getItem("periode");
        setPeriode(saved || "ganjil");
      }
    }
  }, []);

  useEffect(() => {
    if ((userRole === "admin" || userRole === "super admin") && periode) {
      localStorage.setItem("periode", periode);
    }
  }, [periode, userRole]);

  // Ambil pertanyaan
  useEffect(() => {
    const fetchPertanyaan = async () => {
      if (!id || !periode) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get("http://localhost:8000/api/assessment-jenjang-questions", {
          headers,
          params: { jenjang_id: id, periode },
        });

        const data = res.data.data as Pertanyaan[];
        setPertanyaanList(data);

        const grouped: { [key: string]: Pertanyaan[] } = {};
        data.forEach((q) => {
          const temaName = q.tema?.nama || "Tanpa Tema";
          if (!grouped[temaName]) grouped[temaName] = [];
          grouped[temaName].push(q);
        });

        setGroupedByTema(grouped);
        setTemaNames(Object.keys(grouped));
        setCurrentTemaIndex(0);
        setJawaban({});
      } catch (error) {
        console.error("Gagal mengambil pertanyaan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPertanyaan();
  }, [id, periode]);

  const handleJawabanChange = (pertanyaanId: number, value: number) => {
    setJawaban((prev) => ({ ...prev, [pertanyaanId]: value }));
  };

  const handleNextTema = () => {
    const currentTema = temaNames[currentTemaIndex];
    const belumSemuaTerjawab = groupedByTema[currentTema].some((q) => jawaban[q.id] === undefined);
    if (belumSemuaTerjawab) {
      Swal.fire("Oops", "Mohon jawab semua pertanyaan pada tema ini dulu.", "warning");
      return;
    }
    setCurrentTemaIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const semuaTerjawab = pertanyaanList.every((q) => jawaban[q.id] !== undefined);
    if (!semuaTerjawab) {
      Swal.fire("Gagal", "Mohon jawab semua pertanyaan sebelum mengirim.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        jenjang_id: id,
        periode,
        jawaban: Object.entries(jawaban).map(([pertanyaan_id, nilai]) => ({
          pertanyaan_id: parseInt(pertanyaan_id),
          nilai,
        })),
      };

      await axios.post("http://localhost:8000/api/assessment-submit", payload, { headers });
      Swal.fire("Sukses", "Jawaban berhasil dikirim.", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error", "Terjadi kesalahan saat submit.", "error");
    }
  };

  const currentTema = temaNames[currentTemaIndex];
  const pertanyaanTemaSaatIni = groupedByTema[currentTema] || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Assessment</h2>

        {(userRole === "admin" || userRole === "super admin") && (
          <select
            value={periode || ""}
            onChange={(e) => setPeriode(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="ganjil">Periode Ganjil</option>
            <option value="genap">Periode Genap</option>
          </select>
        )}
      </div>

      {(userRole === "mentor" || userRole === "mentee") && (
        <h4 className="text-lg font-bold text-blue-600 mb-2">Isi Assessment</h4>
      )}

      <p className="text-sm text-gray-600 mb-4 italic">
        <b>*Semakin besar angka yang dipilih (1-5), maka semakin tinggi bobot penilaian.</b>
      </p>

      {loading ? (
        <p>Memuat pertanyaan...</p>
      ) : pertanyaanList.length === 0 ? (
        <p className="text-gray-500">Tidak ada pertanyaan untuk jenjang dan periode ini.</p>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4">Tema: {currentTema}</h3>

          <form className="space-y-6">
            {pertanyaanTemaSaatIni.map((q, index) => (
              <div
                key={q.id}
                className="p-4 bg-white border rounded-lg shadow-sm transition hover:shadow-md"
              >
                <p className="font-semibold mb-1">
                  {index + 1}. {q.pertanyaan}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Bobot: {jawaban[q.id] ?? q.bobot}
                </p>

                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className={`flex items-center gap-1 px-3 py-1 border rounded-full cursor-pointer ${
                        jawaban[q.id] === value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`jawaban-${q.id}`}
                        value={value}
                        className="hidden"
                        checked={jawaban[q.id] === value}
                        onChange={() => handleJawabanChange(q.id, value)}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6">
              {currentTemaIndex < temaNames.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextTema}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                >
                  Kirim Jawaban
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
