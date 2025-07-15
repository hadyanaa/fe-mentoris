// main.tsx atau index.tsx
import 'primereact/resources/themes/lara-light-blue/theme.css';  // atau tema lain
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

  useEffect(() => {
    axios.get("http://localhost:8000/api/jenjang")
      .then((res) => setJenjang(res.data.data))
      .catch((err) => console.error("Gagal ambil data jenjang:", err));
  }, []);

  return (
    <div className="card">
      <input
        type="text"
        placeholder="Cari..."
        className="mb-2 p-2 border rounded w-full"
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

    <DataTable
  value={jenjang}
  paginator
  rows={10} // default tampil 10 data
  rowsPerPageOptions={[10, 25, 50, 100]} // user bisa pilih jumlah data
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
