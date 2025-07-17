import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BeritaPrimeTable from "../../services/Berita";

export default function BeritaPage() {
  return (
    <>
      <PageMeta
        title="Halaman Berita"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Berita" />

      <div className="space-y-6">
        <ComponentCard title="">
          <BeritaPrimeTable />
        </ComponentCard>
      </div>
    </>
  );
}
