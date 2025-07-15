import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Mentee {
  nama: string;
  jumlah_hadir: number;
}

export default function PresensiDetailKelompok() {
  const { id } = useParams<{ id: string }>();
  const [mentor, setMentor] = useState<string>("");
  const [jumlahPertemuan, setJumlahPertemuan] = useState<number>(0);
  const [mentees, setMentees] = useState<Mentee[]>([]);

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
        setMentees(data.mentee); // GANTI dari data.mentees
      })
      .catch((err) => {
        console.error("Gagal ambil detail presensi:", err);
      });
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Detail Presensi Kelompok</h2>

      <div className="mb-6">
        <p>
          <strong>Nama Mentor:</strong> {mentor}
        </p>
        <p>
          <strong>Total Pertemuan Kelompok:</strong> {jumlahPertemuan}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-2">
        Daftar Mentee dan Kehadiran:
      </h3>
      <table className="w-full border border-collapse rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">No</th>
            <th className="p-2 border">Nama Mentee</th>
            <th className="p-2 border">Jumlah Hadir</th>
          </tr>
        </thead>
        <tbody>
          {mentees?.map((mentee, index) => (
            <tr key={index} className="text-center hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{mentee.nama}</td>
              <td className="p-2 border">{mentee.jumlah_hadir}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
