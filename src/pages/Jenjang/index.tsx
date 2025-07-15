// pages/jenjang/index.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne"; // Ganti nanti jika ada table khusus

export default function JenjangPage() {
  return (
    <>
      <PageMeta
        title="Halaman Jenjang"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Jenjang" />

      <div className="space-y-6">
        <ComponentCard title="Tabel Jenjang">
          <BasicTableOne /> {/* Ganti nanti jika sudah punya komponen tabel khusus */}
        </ComponentCard>
      </div>
    </>
  );
}
