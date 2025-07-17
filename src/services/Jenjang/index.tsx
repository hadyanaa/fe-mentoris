import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import axios from "axios";
import { useJenjangStore } from '../../store/useJenjangStore';

// interface Jenjang {
//   id: number;
//   nama_jenjang: string;
//   deskripsi: string;
// }

export default function JenjangPrimeTable() {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { data, error, loading, fetchJenjang } = useJenjangStore()

  useEffect(() => {
    fetchJenjang()
  }, [])

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
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        globalFilter={globalFilter}
        emptyMessage="Data tidak ditemukan"
        responsiveLayout="scroll"
        showGridlines
        loading={loading}
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
