import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import KelompokTerajin from "../../services/Kelompok/KelompokAll";

export default function KelompokAllPage() {
  return (
    <>
      <PageMeta
        title="Halaman Kelompok"
        description="Menampilkan data kelompok"
      />
      <PageBreadcrumb pageTitle="All Kelompok" />

      <div className="space-y-6">
        <ComponentCard title="">
         <KelompokTerajin/>
        </ComponentCard>
      </div>
    </>
  );
}
