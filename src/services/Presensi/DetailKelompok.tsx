import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface MateriItem {
  materi: string;
  tanggal: string;
}
interface Mentee {
  nama: string;
  jumlah_hadir: number;
}

export default function PresensiDetailKelompok() {
  const { id } = useParams<{ id: string }>();
  const [mentor, setMentor] = useState<string>("");
  const [jumlahPertemuan, setJumlahPertemuan] = useState<number>(0);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [materi, setMateri] = useState<MateriItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8000/api/presensi/kelompok/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        setMentor(data.mentor);
        setJumlahPertemuan(data.jumlah_pertemuan);
        setMentees(data.mentee);
        setMateri(data.materi_disampaikan);
      })
      .catch((err) => {
        console.error("Gagal ambil detail presensi:", err);
      });
  }, [id]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Detail Presensi Kelompok</h2>

      {/* Info Mentor & Pertemuan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded shadow-sm">
          <p className="text-sm text-gray-600">Nama Mentor</p>
          <p className="text-lg font-semibold text-blue-800">{mentor}</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow-sm">
          <p className="text-sm text-gray-600">Total Pertemuan</p>
          <p className="text-lg font-semibold text-green-800">{jumlahPertemuan}</p>
        </div>
      </div>

      {/* Daftar Mentee */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Daftar Mentee dan Kehadiran</h3>
      <div className="overflow-x-auto rounded border border-gray-200 shadow-sm mb-10">
        <table className="min-w-full text-center text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">No</th>
              <th className="p-3 border">Nama Mentee</th>
              <th className="p-3 border">Jumlah Hadir</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{mentee.nama}</td>
                <td className="p-2 border text-green-700 font-medium">{mentee.jumlah_hadir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Materi */}
      {materi.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Materi yang Sudah Disampaikan
          </h3>
          <table className="min-w-full border border-gray-200 rounded shadow-sm text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">Materi</th>
                <th className="px-4 py-2 border">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {materi.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-center">
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{item.materi}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
