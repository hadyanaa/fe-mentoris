import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AngkatanPrimeTable from "../../services/Angkatan";

export default function AngkatanPage() {
  return (
    <>
      <PageMeta
        title="Halaman Angkatan"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Angkatan" />

      <div className="space-y-6">
        <ComponentCard title="">
          <AngkatanPrimeTable />
        </ComponentCard>
      </div>
    </>
  );
}
