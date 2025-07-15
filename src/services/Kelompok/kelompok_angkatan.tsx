import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Kelompok {
  id: number;
  nama: string;
  angkatan: {
    nama: string;
    tahun: string;
  };
}

export default function KelompokListByAngkatan() {
  const { angkatanId } = useParams<{ angkatanId: string }>();
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([]);
  const [angkatanNama, setAngkatanNama] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`http://localhost:8000/api/kelompok/angkatan/${angkatanId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setKelompokList(res.data.data);
        if (res.data.data.length > 0) {
          setAngkatanNama(res.data.data[0].angkatan.nama);
        }
      })
      .catch((err) => {
        console.error("Gagal ambil data kelompok:", err);
      });
  }, [angkatanId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Kelompok Angkatan: {angkatanNama}</h2>

      <DataTable
        value={kelompokList}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="Tidak ada data kelompok"
        responsiveLayout="scroll"
        showGridlines
      >
        <Column
          header="No"
          body={(_rowData, { rowIndex }) => rowIndex + 1}
          style={{ width: "60px" }}
        />
        <Column field="nama_kelompok" header="Nama Kelompok" />
        <Column
          header="Aksi"
          body={(rowData) => (
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => navigate(`/presensi/kelompok/${rowData.id}`)}
            >
              Lihat Presensi
            </button>
          )}
        />
      </DataTable>
    </div>
  );
}
