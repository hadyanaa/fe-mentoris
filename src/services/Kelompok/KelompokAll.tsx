import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Kelompok {
  id: number;
  nama_kelompok: string;
  jenis_kelamin: string;
  jumlah_anggota: number;
  jumlah_pertemuan: number;
}

export default function KelompokTerajin() {
  const navigate = useNavigate();
  const [dataKelompok, setDataKelompok] = useState<Kelompok[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  useEffect(() => {
    fetchKelompok();
  }, []);

  const fetchKelompok = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak tersedia');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/kelompok-terajin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDataKelompok(response.data.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
      setError('Gagal mengambil data kelompok');
    } finally {
      setLoading(false);
    }
  };

  const rowNumberTemplate = (_rowData: any, options: any) => <span>{options.rowIndex + 1}</span>;

  const renderHeader = () => (
    <div className="flex justify-end mb-3">
      <span className="p-input-icon-left">
        <InputText
          type="search"
          placeholder="Cari kelompok..."
          className="p-inputtext-sm"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </span>
    </div>
  );

  const handleDetail = (id: number) => {
    navigate(`/presensi/kelompok/${id}`);
  };

  const actionTemplate = (rowData: Kelompok) => (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
        onClick={() => handleDetail(rowData.id)}
      >
        Detail
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daftar Semua Kelompok</h2>

      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <ProgressSpinner />
        </div>
      )}

      {error && <p className="text-red-600 font-medium text-center">{error}</p>}

      {!loading && !error && (
        <DataTable
          value={dataKelompok}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          stripedRows
          responsiveLayout="scroll"
          showGridlines
          globalFilter={globalFilter}
          header={renderHeader()}
          emptyMessage="Tidak ada data kelompok ditemukan."
          className="text-sm"
        >
          <Column header="No" body={rowNumberTemplate} style={{ width: '50px' }} />
          <Column field="nama_kelompok" header="Nama Kelompok" />
          <Column field="jenis_kelamin" header="Jenis Kelamin" />
          <Column field="jumlah_anggota" header="Jumlah Anggota" />
          <Column field="jumlah_pertemuan" header="Jumlah Pertemuan" />
          <Column body={actionTemplate} header="Aksi" style={{ width: '120px' }} />
        </DataTable>
      )}
    </div>
  );
}
