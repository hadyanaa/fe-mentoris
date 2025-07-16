import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";


import PenggunaPrimeTable from "../../services/Pengguna/PenggunaList";

export default function PenggunaPage() {
  return (
    <>
      <PageMeta
        title="Halaman Pengguna"
        description="Menampilkan data Pengguna"
      />
      <PageBreadcrumb pageTitle="Pengguna" />

      <div className="space-y-6">
        <ComponentCard title="">
           <PenggunaPrimeTable/>
        </ComponentCard>
      </div>
    </>
  );
}
