import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2"; // 

interface Angkatan {
  id: number;
  nama: string;
  tahun: string;
}

interface Jenjang {
  id: number;
  nama_jenjang: string;
}

export default function FormCreateUser() {
  const navigate = useNavigate();
  const [angkatanList, setAngkatanList] = useState<Angkatan[]>([]);
  const [jenjangList, setJenjangList] = useState<Jenjang[]>([]);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    password: "",
    role: "",
    tempat_lahir: "",
    tgl_lahir: null as Date | null,
    pertama_mentoring: null as Date | null,
    jenis_kelamin: "",
    alamat_asal: "",
    alamat_domisili: "",
    prodi: "",
    angkatan_id: "",
    jenjang_id: "",
    no_hp: "",
    akun_ig: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/angkatan", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAngkatanList(res.data.data))
      .catch(() =>
        Swal.fire("Gagal", "Gagal mengambil data angkatan", "error")
      );

    axios
      .get("http://localhost:8000/api/jenjang", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJenjangList(res.data.data))
      .catch(() => Swal.fire("Gagal", "Gagal mengambil data jenjang", "error"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      tgl_lahir: formData.tgl_lahir
        ? formData.tgl_lahir.toISOString().split("T")[0]
        : "",
      pertama_mentoring: formData.pertama_mentoring
        ? formData.pertama_mentoring.toISOString().split("T")[0]
        : "",
    };

    axios
      .post("http://localhost:8000/api/pengguna", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        Swal.fire("Berhasil", "Pengguna berhasil ditambahkan", "success").then(
          () => navigate(-1)
        );
      })
      .catch((err) => {
        console.error("Gagal menyimpan:", err);
        Swal.fire("Error", "Terjadi kesalahan saat menyimpan data", "error");
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Pengguna</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nama_lengkap"
            placeholder="Nama Lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Role (admin/mentor/mentee)"
            value={formData.role}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="tempat_lahir"
            placeholder="Tempat Lahir"
            value={formData.tempat_lahir}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <DatePicker
            selected={formData.tgl_lahir}
            onChange={(date) => handleDateChange(date, "tgl_lahir")}
            placeholderText="Tanggal Lahir"
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded w-full"
          />

          <DatePicker
            selected={formData.pertama_mentoring}
            onChange={(date) => handleDateChange(date, "pertama_mentoring")}
            placeholderText="Pertama Mentoring"
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded w-full"
          />

          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>

          <input
            type="text"
            name="alamat_asal"
            placeholder="Alamat Asal"
            value={formData.alamat_asal}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="alamat_domisili"
            placeholder="Alamat Domisili"
            value={formData.alamat_domisili}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="prodi"
            placeholder="Prodi"
            value={formData.prodi}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="angkatan_id"
            value={formData.angkatan_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Angkatan</option>
            {angkatanList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nama} - {a.tahun}
              </option>
            ))}
          </select>

          <select
            name="jenjang_id"
            value={formData.jenjang_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Jenjang</option>
            {jenjangList.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama_jenjang}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="no_hp"
            placeholder="Nomor HP"
            value={formData.no_hp}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="akun_ig"
            placeholder="Akun Instagram"
            value={formData.akun_ig}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Pengguna
        </button>
      </form>
    </div>
  );
}
