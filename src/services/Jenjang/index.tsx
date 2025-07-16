import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";

interface Jenjang {
  id: number;
  nama_jenjang: string;
  deskripsi: string;
}

export default function JenjangPrimeTable() {
  const [jenjang, setJenjang] = useState<Jenjang[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("Token tidak tersedia. Silakan login terlebih dahulu.");
    return;
  }

  axios.get("http://localhost:8000/api/jenjang", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.data.success) {
        setJenjang(res.data.data);
      } else {
        setError("Gagal memuat data jenjang dari server.");
      }
    })
    .catch((err) => {
      console.error("Gagal ambil data jenjang:", err);
      setError("Terjadi kesalahan saat mengambil data jenjang.");
    });
}, []);


  return (
    <div className="card p-4">
      <h2 className="text-lg font-bold mb-3">Daftar Jenjang</h2>

      {error && (
        <div className="mb-3 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <input
        type="text"
        placeholder="Cari..."
        className="mb-3 p-2 border rounded w-full"
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <DataTable
        value={jenjang}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="Data tidak ditemukan"
        responsiveLayout="scroll"
        showGridlines
      >
        <Column
          header="No"
          body={(_rowData, { rowIndex }) => rowIndex + 1}
          style={{ width: '60px' }}
        />
        <Column field="nama_jenjang" header="Nama Jenjang" />
        <Column field="deskripsi" header="Deskripsi" />
      </DataTable>
    </div>
  );
}
