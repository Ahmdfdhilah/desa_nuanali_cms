import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/login';
import { AuthProvider } from './AuthProvider';
import AdminPrivateRoute from './PrivateRoute';
import { AgendaTable, BeritaTable, CreateAgenda, CreateBerita, CreateDanaDesa, CreateEducation, CreateLapak, CreateLembaga, CreatePekerjaan, CreatePembangunan, CreatePrestasi, CreateReligion, CreateSekolah, CreateStatus, CreateStruktur, CreateUsia, CreateWilayah, CreateWisata, DanaDesaTable, EducationTable, GenderTable, LapakTable, LembagaTable, PekerjaanTable, PembangunanTable, PrestasiTable, ReligionTable, SekolahTable, StatusTable, StrukturTable, UpdateAgenda, UpdateBerita, UpdateDanaDesa, UpdateEducation, UpdateLapak, UpdateLembaga, UpdatePekerjaan, UpdatePembangunan, UpdatePrestasi, UpdateReligion, UpdateSekolah, UpdateStatus, UpdateStruktur, UpdateUsia, UpdateWilayah, UpdateWisata, UsiaTable, WilayahTable, WisataTable } from './pages/cms';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PhotoGallery from './pages/cms/photo';
import VideoGallery from './pages/cms/videos';
import CreateGender from './pages/cms/gender/create';
import UpdateGender from './pages/cms/gender/update';
import HomeCMS from './pages';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPrivateRoute Component={HomeCMS} />} />
        <Route path="/admin/struktur" element={<AdminPrivateRoute Component={StrukturTable} />} />
        <Route path="/admin/struktur/create" element={<AdminPrivateRoute Component={CreateStruktur} />} />
        <Route path="/admin/struktur/update/:id" element={<AdminPrivateRoute Component={UpdateStruktur} />} />
        <Route path="/admin/agenda" element={<AdminPrivateRoute Component={AgendaTable} />} />
        <Route path="/admin/agenda/create" element={<AdminPrivateRoute Component={CreateAgenda} />} />
        <Route path="/admin/agenda/update/:id" element={<AdminPrivateRoute Component={UpdateAgenda} />} />
        <Route path="/admin/berita" element={<AdminPrivateRoute Component={BeritaTable} />} />
        <Route path="/admin/berita/create" element={<AdminPrivateRoute Component={CreateBerita} />} />
        <Route path="/admin/berita/update/:id" element={<AdminPrivateRoute Component={UpdateBerita} />} />
        <Route path="/admin/lembaga" element={<AdminPrivateRoute Component={LembagaTable} />} />
        <Route path="/admin/lembaga/create" element={<AdminPrivateRoute Component={CreateLembaga} />} />
        <Route path="/admin/lembaga/update/:id" element={<AdminPrivateRoute Component={UpdateLembaga} />} />
        <Route path="/admin/wisata" element={<AdminPrivateRoute Component={WisataTable} />} />
        <Route path="/admin/wisata/create" element={<AdminPrivateRoute Component={CreateWisata} />} />
        <Route path="/admin/wisata/update/:id" element={<AdminPrivateRoute Component={UpdateWisata} />} />
        <Route path="/admin/lapak" element={<AdminPrivateRoute Component={LapakTable} />} />
        <Route path="/admin/lapak/create" element={<AdminPrivateRoute Component={CreateLapak} />} />
        <Route path="/admin/lapak/update/:id" element={<AdminPrivateRoute Component={UpdateLapak} />} />
        <Route path="/admin/prestasi" element={<AdminPrivateRoute Component={PrestasiTable} />} />
        <Route path="/admin/prestasi/create" element={<AdminPrivateRoute Component={CreatePrestasi} />} />
        <Route path="/admin/prestasi/update/:id" element={<AdminPrivateRoute Component={UpdatePrestasi} />} />
        <Route path="/admin/pembangunan" element={<AdminPrivateRoute Component={PembangunanTable} />} />
        <Route path="/admin/pembangunan/create" element={<AdminPrivateRoute Component={CreatePembangunan} />} />
        <Route path="/admin/pembangunan/update/:id" element={<AdminPrivateRoute Component={UpdatePembangunan} />} />
        <Route path="/admin/wilayah" element={<AdminPrivateRoute Component={WilayahTable} />} />
        <Route path="/admin/wilayah/create" element={<AdminPrivateRoute Component={CreateWilayah} />} />
        <Route path="/admin/wilayah/update/:id" element={<AdminPrivateRoute Component={UpdateWilayah} />} />
        <Route path="/admin/dana-desa" element={<AdminPrivateRoute Component={DanaDesaTable} />} />
        <Route path="/admin/dana-desa/create" element={<AdminPrivateRoute Component={CreateDanaDesa} />} />
        <Route path="/admin/dana-desa/update/:id" element={<AdminPrivateRoute Component={UpdateDanaDesa} />} />
        <Route path="/admin/gender" element={<AdminPrivateRoute Component={GenderTable} />} />
        <Route path="/admin/gender/create" element={<AdminPrivateRoute Component={CreateGender} />} />
        <Route path="/admin/gender/update/:id" element={<AdminPrivateRoute Component={UpdateGender} />} />
        <Route path="/admin/education" element={<AdminPrivateRoute Component={EducationTable} />} />
        <Route path="/admin/education/create" element={<AdminPrivateRoute Component={CreateEducation} />} />
        <Route path="/admin/education/update/:id" element={<AdminPrivateRoute Component={UpdateEducation} />} />
        <Route path="/admin/sekolah" element={<AdminPrivateRoute Component={SekolahTable} />} />
        <Route path="/admin/sekolah/create" element={<AdminPrivateRoute Component={CreateSekolah} />} />
        <Route path="/admin/sekolah/update/:id" element={<AdminPrivateRoute Component={UpdateSekolah} />} />
        <Route path="/admin/religion" element={<AdminPrivateRoute Component={ReligionTable} />} />
        <Route path="/admin/religion/create" element={<AdminPrivateRoute Component={CreateReligion} />} />
        <Route path="/admin/religion/update/:id" element={<AdminPrivateRoute Component={UpdateReligion} />} />
        <Route path="/admin/usia" element={<AdminPrivateRoute Component={UsiaTable} />} />
        <Route path="/admin/usia/create" element={<AdminPrivateRoute Component={CreateUsia} />} />
        <Route path="/admin/usia/update/:id" element={<AdminPrivateRoute Component={UpdateUsia} />} />
        <Route path="/admin/status" element={<AdminPrivateRoute Component={StatusTable} />} />
        <Route path="/admin/status/create" element={<AdminPrivateRoute Component={CreateStatus} />} />
        <Route path="/admin/status/update/:id" element={<AdminPrivateRoute Component={UpdateStatus} />} />
        <Route path="/admin/pekerjaan" element={<AdminPrivateRoute Component={PekerjaanTable} />} />
        <Route path="/admin/pekerjaan/create" element={<AdminPrivateRoute Component={CreatePekerjaan} />} />
        <Route path="/admin/pekerjaan/update/:id" element={<AdminPrivateRoute Component={UpdatePekerjaan} />} />
        <Route path="/admin/photo" element={<AdminPrivateRoute Component={PhotoGallery} />} />
        <Route path="/admin/videos" element={<AdminPrivateRoute Component={VideoGallery} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </AuthProvider>
);
