import { BrowserRouter as Router, Routes, Route } from "react-router";
// import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import KurikulumPage from "./pages/Kurikulum";
import JenjangPage from "./pages/Jenjang";
import SignInForm from "./components/auth/SignInForm";
import PresensiIndex from "./services/Presensi";
import KelompokAngkatanPage from "./pages/Kelompok/kelompok_angkatan";
import DetailKelompokPage from "./pages/Presensi/DetailKelompok";

import RekapPresensiMentee from "./services/Presensi/RekapPresensiMentee";
import PrivateRoutesByRole from "./services/PrivateRoute";
import PresensiReviewkPage from "./pages/Presensi/PresensiReview";
import ProtectedLoginRoute from "./services/ProtectedLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditKelompokPage from "./services/Kelompok/editKelompokPage";
import PenggunaPage from "./pages/Pengguna/PenggunaPage";
import FormCreateUser from "./services/Pengguna/PenggunaCreate";
import FormCreateJenjang from "./pages/Jenjang/TambahJenjang";
import FormEditJenjang from "./pages/Jenjang/EditJenjang";
import BeritaPrimeTable from "./pages/Berita";
import FormCreateBerita from "./pages/Berita/TambahBerita";
import FormEditBerita from "./pages/Berita/EditBerita";
import BeritaPage from "./pages/Berita";
import AngkatanPage from "./pages/Angkatan";
import FormCreateAngkatan from "./pages/Angkatan/TambahAngkatan";
import FormEditAngkatan from "./pages/Angkatan/EditAngkatan";
import FormCreateKurikulum from "./pages/Kurikulum/TambahKurikulum";
import TemaPage from "./pages/Tema";
import FormCreateTema from "./pages/Tema/TambahTema";
import FormEditTema from "./pages/Tema/EditTema";
import EditPresensiPage from "./services/Presensi/EditPresensi";
import DetailPresensi from "./services/Presensi/DetailPresensi";
import FormTambahKelompok from "./services/Kelompok/CreateKelompok";
import FormTambahKelompokPengguna from "./services/Kelompok/CreateKelompokPengguna";
import PindahKelompokMentee from "./services/Kelompok/PindahKelompok";

import KelompokAllPage from "./pages/Kelompok/KelompokAll";
import HalamanAsessment from "./services/Asessment";
import AssessmentByJenjang from "./services/Asessment/AsessmentJenjang";
import TerimaKasih from "./services/Asessment/Terimakasih";

export default function App() {
  return (
    <>
    <Router>
  <ScrollToTop />
  <Routes>
    {/* PUBLIC */}
   <Route
  path="/login"
  element={
    <ProtectedLoginRoute>
      <SignInForm />
      </ProtectedLoginRoute>  
  }
/>
    {/* <Route path="/signin" element={<SignIn />} /> */}
    <Route path="/signup" element={<SignUp />} />
    <Route path="*" element={<NotFound />} />

    {/* PROTECTED LAYOUT */}
    <Route element={<AppLayout />}>

      {/* UNIVERSAL - semua yang login bisa akses */}
      <Route path="/profile" element={<UserProfiles />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/blank" element={<Blank />} />

      {/* MENTEE ONLY */}
      <Route element={<PrivateRoutesByRole allowedRoles={["mentee", "mentor", "admin", "super admin"]} />}>
        <Route path="/" element={<Home />} />
        <Route path="/rekap-presensi-mentee" element={<RekapPresensiMentee />} />
        <Route path="/presensi" element={<PresensiIndex />} />
        <Route path="/berita" element={<BeritaPrimeTable />} />
        <Route path="/berita/:beritaId" element={<KelompokAngkatanPage />} />
        <Route path="/presensi/detail" element={<DetailPresensi />} />
         <Route path="/assesment/question" element={<HalamanAsessment />} />
         <Route path="/assessment/jenjang/:id" element={<AssessmentByJenjang/>} />
         <Route path="/terimakasih" element={<TerimaKasih />} />
        

      </Route>

      {/* MENTOR + ADMIN + SUPER ADMIN */}
      <Route element={<PrivateRoutesByRole allowedRoles={["mentor", "admin", "super admin"]} />}>
        <Route path="/berita" element={<BeritaPrimeTable />} />
        <Route path="/kurikulum" element={<KurikulumPage />} />
        <Route path="/presensi/preview/:id" element={<PresensiReviewkPage />} />
        <Route path="/presensi/kelompok/:id" element={<DetailKelompokPage />} />
        <Route path="/pengguna/tambah" element={<FormCreateUser />} />
        <Route path="/presensi/edit/:id" element={<EditPresensiPage />} />


      </Route>

      {/* ADMIN + SUPER ADMIN ONLY */}
      <Route element={<PrivateRoutesByRole allowedRoles={["admin", "super admin"]} />}>
      <Route path="/master/data-pengguna" element={<PenggunaPage/>}></Route>
       <Route path="/dashboard" element={<Dashboard/>} />
       <Route path="/kelompok/edit/:id" element={<EditKelompokPage />} />
        <Route path="/master/data-berita" element={<BeritaPage />} />
        <Route path="/master/data-berita/tambah" element={<FormCreateBerita />} />
        <Route path="/master/data-berita/edit/:beritaId" element={<FormEditBerita />} />
        <Route path="/master/data-jenjang" element={<JenjangPage />} />
        <Route path="/master/data-jenjang/tambah" element={<FormCreateJenjang />} />
        <Route path="/master/data-jenjang/edit/:jenjangId" element={<FormEditJenjang />} />
        <Route path="/master/data-angkatan" element={<AngkatanPage />} />
        <Route path="/master/data-angkatan/tambah" element={<FormCreateAngkatan />} />
        <Route path="/master/data-angkatan/edit/:angkatanId" element={<FormEditAngkatan />} />
        <Route path="/kelompok/angkatan/:angkatanId" element={<KelompokAngkatanPage />} />
      <Route path="/kelompok/tambah" element={<FormTambahKelompok />} />
      <Route path="/kelompok-pengguna/:id" element={<FormTambahKelompokPengguna />} />
      <Route path="/kelompok/:id/kelola-anggota" element={<PindahKelompokMentee />} />
       <Route path="/kelompok-terajin" element={<KelompokAllPage />} />


        <Route path="/assesment/tema" element={<TemaPage />} />
        <Route path="/assesment/tema/tambah" element={<FormCreateTema />} />
        <Route path="/assesment/tema/edit/:temaId" element={<FormEditTema />} />
        <Route path="/kurikulum/tambah" element={<FormCreateKurikulum />} />

      </Route>

      {/* Demo pages for all roles */}
      <Route path="/form-elements" element={<FormElements />} />
      <Route path="/basic-tables" element={<BasicTables />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/avatars" element={<Avatars />} />
      <Route path="/badge" element={<Badges />} />
      <Route path="/buttons" element={<Buttons />} />
      <Route path="/images" element={<Images />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/line-chart" element={<LineChart />} />
      <Route path="/bar-chart" element={<BarChart />} />
    </Route>
  </Routes>
</Router>
    </>
  );
}
