import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/login';
import { AuthProvider } from './AuthProvider';
import AdminPrivateRoute from './PrivateRoute';
import { AgendaTable, BeritaTable, CreateAgenda, CreateBerita, CreateDanaDesa, CreateLapak, CreateLembaga, CreatePembangunan, CreatePrestasi, CreateStruktur, CreateWilayah, CreateWisata, DanaDesaTable, LapakTable, LembagaTable, PembangunanTable, PrestasiTable, StrukturTable, UpdateAgenda, UpdateBerita, UpdateDanaDesa, UpdateLapak, UpdateLembaga, UpdatePembangunan, UpdatePrestasi, UpdateStruktur, UpdateWilayah, UpdateWisata, WilayahTable, WisataTable } from './pages/cms';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PhotoGallery from './pages/cms/photo';
import VideoGallery from './pages/cms/videos';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route path="/admin/photo" element={<AdminPrivateRoute Component={PhotoGallery} />} />
        <Route path="/admin/videos" element={<AdminPrivateRoute Component={VideoGallery} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </AuthProvider>
);
