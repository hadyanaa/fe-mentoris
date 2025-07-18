import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TemaPrimeTable from "../../services/Tema";

export default function TemaPage() {
  return (
    <>
      <PageMeta
        title="Halaman Tema"
        description="Menampilkan data jenjang pendidikan"
      />
      <PageBreadcrumb pageTitle="Tema" />

      <div className="space-y-6">
        <ComponentCard title="">
          <TemaPrimeTable />
        </ComponentCard>
      </div>
    </>
  );
}
