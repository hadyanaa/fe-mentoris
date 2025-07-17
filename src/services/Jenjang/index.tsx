import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useJenjangStore } from '../../store/useJenjangStore';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";

export default function JenjangPrimeTable() {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const { data, error, loading, fetchJenjang, deleteJenjang } = useJenjangStore()

  const navigate = useNavigate();

  useEffect(() => {
    fetchJenjang()
  }, [])

  const handleUpdate = (row: any) => {
    // Navigasi ke form edit
    navigate(`/master/data-jenjang/edit/${row.id}`);
  };

  const handleDelete = async (id: any) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await deleteJenjang(id); // fungsi dari zustand
        fetchJenjang(); // refresh data
        alert('Data berhasil dihapus');
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus data');
      }
    }
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Daftar Jenjang</h2>
        <Button
          label="Tambah Jenjang"
          icon="pi pi-plus"
          className="p-button-sm p-button-primary"
          onClick={() => navigate("/master/data-jenjang/tambah")}
        />
      </div>

      {error && (
        <div className="mb-3 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <input
        type="text"
        placeholder="Cari Jenjang..."
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
        <Column 
          header="Aksi"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                onClick={() => handleUpdate(rowData)}
                severity='info'
                size='small'
              >
                Update
              </Button>
              <Button
                onClick={() => handleDelete(rowData.id)}
                severity='danger'
                size='small'
              >
                Delete
              </Button>
            </div>
          )}
          style={{ width: '150px' }}
        />
      </DataTable>
    </div>
  );
}
