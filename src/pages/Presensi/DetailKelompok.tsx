import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PresensiDetailKelompok from "../../services/Presensi/DetailKelompok";

export default function DetailKelompokPage() {
  return (
    <>
      <PageMeta
        title="Halaman Kelompok"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Kelompok" />

      <div className="space-y-6">
        <ComponentCard title="">
            <PresensiDetailKelompok/>
        </ComponentCard>
      </div>
    </>
  );
}
