// pages/kurikulum/index.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import KurikulumPrimeTable from "../../services/Kurikulum";

export default function KurikulumPage() {
  return (
    <>
      <PageMeta
        title="Halaman Kurikulum"
        description="Menampilkan data kurikulum dalam bentuk tabel"
      />
      <PageBreadcrumb pageTitle="Kurikulum" />

      <div className="space-y-6">
        <ComponentCard title="Tabel Kurikulum">
          <KurikulumPrimeTable />
        </ComponentCard>
      </div>
    </>
  );
}
