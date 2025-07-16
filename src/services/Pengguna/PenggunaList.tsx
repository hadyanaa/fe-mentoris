import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';
import axios from "axios";

interface Pengguna {
  id: number;
  nama_lengkap: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jenis_kelamin: string;
  alamat_asal: string;
  alamat_domisili: string;
  prodi: string;
  no_hp: string;
  akun_ig: string;
  user_id: number;
  jenjang?: {
    nama_jenjang: string;
  };
  angkatan?: {
    nama: string;
  };
}

export default function PenggunaPrimeTable() {
  const [pengguna, setPengguna] = useState<Pengguna[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token tidak tersedia. Silakan login terlebih dahulu.");
      return;
    }

    axios
      .get("http://localhost:8000/api/pengguna", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setPengguna(res.data.data);
        } else {
          setError("Gagal memuat data pengguna dari server.");
        }
      })
      .catch((err) => {
        console.error("Gagal ambil data pengguna:", err);
        setError("Terjadi kesalahan saat mengambil data pengguna.");
      });
  }, []);

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Daftar Pengguna</h2>
        <Button
          label="Tambah Pengguna"
          icon="pi pi-plus"
          className="p-button-sm p-button-primary"
          onClick={() => navigate("/pengguna/tambah")}
        />
      </div>

      {error && (
        <div className="mb-3 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <input
        type="text"
        placeholder="Cari pengguna..."
        className="mb-3 p-2 border rounded w-full"
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <DataTable
        value={pengguna}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        globalFilter={globalFilter}
        emptyMessage="Data tidak ditemukan"
        responsiveLayout="scroll"
        showGridlines
      >
        <Column
          header="No"
          body={(_, { rowIndex }) => rowIndex + 1}
          style={{ width: '60px' }}
        />
        <Column field="nama_lengkap" header="Nama Lengkap" />
        <Column field="jenis_kelamin" header="Jenis Kelamin" />
        <Column field="prodi" header="Prodi" />
        <Column field="no_hp" header="No HP" />
        <Column field="akun_ig" header="Instagram" />
        <Column
          field="jenjang.nama_jenjang"
          header="Jenjang"
          body={(rowData) => rowData.jenjang?.nama_jenjang}
        />
        <Column
          field="angkatan.nama"
          header="Angkatan"
          body={(rowData) => rowData.angkatan?.nama}
        />
      </DataTable>
    </div>
  );
}
