import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import JenjangTable from "../../services/Jenjang";// ganti table khusus

export default function JenjangPage() {
  return (
    <>
      <PageMeta
        title="Halaman Jenjang"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Jenjang" />

      <div className="space-y-6">
        <ComponentCard title="">
          <JenjangTable />
        </ComponentCard>
      </div>
    </>
  );
}
