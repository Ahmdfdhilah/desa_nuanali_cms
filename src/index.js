import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/login';
import { AuthProvider } from './AuthProvider';
import AdminPrivateRoute from './PrivateRoute';
import { AgendaTable, BeritaTable, CreateAgenda, CreateBerita, CreateStruktur, StrukturTable, UpdateAgenda, UpdateBerita, UpdateStruktur } from './pages/cms';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
