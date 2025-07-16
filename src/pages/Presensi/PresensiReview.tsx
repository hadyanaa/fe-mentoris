import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import PresensiMentorTable from "../../services/Presensi/PresensiReview";

export default function PresensiReviewkPage() {
  return (
    <>
      <PageMeta
        title="Halaman Presensi"
        description="Menampilkan data Presensi"
      />
      <PageBreadcrumb pageTitle="Presensi" />

      <div className="space-y-6">
        <ComponentCard title="">
           <PresensiMentorTable/>
        </ComponentCard>
      </div>
    </>
  );
}
