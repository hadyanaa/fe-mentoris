import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import KelompokListByAngkatan from "../../services/Kelompok/kelompok_angkatan";
export default function KelompokAngkatanPage() {
  return (
    <>
      <PageMeta
        title="Halaman Kelompok"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Kelompok" />

      <div className="space-y-6">
        <ComponentCard title="">
         <KelompokListByAngkatan />
        </ComponentCard>
      </div>
    </>
  );
}
