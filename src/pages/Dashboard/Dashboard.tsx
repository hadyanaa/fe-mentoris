import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface KelompokTerajin {
  id: number;
  nama_kelompok: string;
  total_pertemuan: number;
}

// Interface
interface JenisKelamin {
  laki_laki: number;
  perempuan: number;
}

interface KelompokPerJenisKelamin {
  laki_laki: number;
  perempuan: number;
}

interface KelompokPerAngkatan {
  angkatan: string;
  jumlah_kelompok: number;
}

interface PenggunaPerJenjang {
  jenjang: string;
  jumlah_pengguna: number;
}

interface PresensiPerBulan {
  bulan: string;
  jumlah: number;
}

interface DashboardData {
  jenis_kelamin: JenisKelamin;
  total_pengguna: number;
  total_kelompok: number;
  kelompok_per_jenis_kelamin: KelompokPerJenisKelamin;
  kelompok_per_angkatan: KelompokPerAngkatan[];
  pengguna_per_jenjang: PenggunaPerJenjang[];
  presensi_per_bulan: PresensiPerBulan[];
  kelompok_terajin: KelompokTerajin[];
}

export default function DashboardChart() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token tidak tersedia. Silakan login terlebih dahulu.");
      return;
    }

    axios
      .get("http://localhost:8000/api/dashboard/statistik", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Gagal memuat data dashboard.");
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data dashboard:", err);
        setError("Terjadi kesalahan saat mengambil data.");
      });
  }, []);

  if (error) return <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>;
  if (!data) return <p>Memuat data...</p>;

  // Chart data
  const jenisKelaminChart = {
    labels: ["Laki-laki", "Perempuan"],
    datasets: [
      {
        label: "Jumlah",
        data: [data.jenis_kelamin.laki_laki, data.jenis_kelamin.perempuan],
        backgroundColor: ["#3B82F6", "#F472B6"],
      },
    ],
  };

  const kelompokAngkatanChart = {
    labels: data.kelompok_per_angkatan.map((item) => item.angkatan),
    datasets: [
      {
        label: "Jumlah Kelompok",
        data: data.kelompok_per_angkatan.map((item) => item.jumlah_kelompok),
        backgroundColor: "#34D399",
      },
    ],
  };

  const penggunaJenjangChart = {
    labels: data.pengguna_per_jenjang.map((item) => item.jenjang),
    datasets: [
      {
        label: "Jumlah Pengguna",
        data: data.pengguna_per_jenjang.map((item) => item.jumlah_pengguna),
        backgroundColor: "#FBBF24",
      },
    ],
  };

  const presensiChart = {
    labels: data.presensi_per_bulan.map((item) => item.bulan),
    datasets: [
      {
        label: "Jumlah Presensi",
        data: data.presensi_per_bulan.map((item) => item.jumlah),
        backgroundColor: "#60A5FA",
      },
    ],
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard Statistik</h1>

      {/* Informasi Ringkas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-100 p-4 rounded shadow text-center">
          <p className="text-sm font-medium">Total Pengguna</p>
          <p className="text-2xl font-bold">{data.total_pengguna}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-sm font-medium">Total Kelompok</p>
          <p className="text-2xl font-bold">{data.total_kelompok}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-sm font-medium">Kelompok Laki-laki</p>
          <p className="text-2xl font-bold">{data.kelompok_per_jenis_kelamin.laki_laki}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded shadow text-center">
          <p className="text-sm font-medium">Kelompok Perempuan</p>
          <p className="text-2xl font-bold">{data.kelompok_per_jenis_kelamin.perempuan}</p>
        </div>
      </div>

      {/* Jenis Kelamin */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Distribusi Jenis Kelamin</h2>
        <div className="w-full md:w-1/2 mx-auto">
          <Pie data={jenisKelaminChart} />
        </div>
      </div>

      {/* Kelompok per Angkatan & Pengguna per Jenjang */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Kelompok per Angkatan</h2>
          <Bar data={kelompokAngkatanChart} />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Pengguna per Jenjang</h2>
          <Bar data={penggunaJenjangChart} />
        </div>
      </div>

      {/* Grafik Presensi per Bulan */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Presensi per Bulan</h2>
        <Bar data={presensiChart} />
      </div>

<div className="bg-white p-4 shadow rounded">
  <h2 className="text-lg font-semibold mb-2">Urutan Kelompok Terajin</h2>
  <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
    <table className="w-full text-sm text-left border">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          <th className="p-2 border">#</th>
          <th className="p-2 border">Nama Kelompok</th>
          <th className="p-2 border">Total Pertemuan</th>
        </tr>
      </thead>
      <tbody>
        {data.kelompok_terajin.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="p-2 border">{index + 1}</td>
            <td className="p-2 border">{item.nama_kelompok}</td>
            <td className="p-2 border">{item.total_pertemuan}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



    </div>

    
  );
}
