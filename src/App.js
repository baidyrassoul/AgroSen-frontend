import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rendement from './pages/Rendement';
import Marketplace from './pages/Marketplace';
import Publication from './pages/Publication';
import Diagnostic from './pages/Diagnostic';
import Parcelles from './pages/Parcelles';
import Historique from './pages/Historique';
import Premium from './pages/Premium';
import ProfilAgriculteur from './pages/ProfilAgriculteur';
import Panier from './pages/Panier';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rendement" element={<ProtectedRoute><Rendement /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/publication" element={<ProtectedRoute><Publication /></ProtectedRoute>} />
        <Route path="/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
        <Route path="/parcelles" element={<ProtectedRoute><Parcelles /></ProtectedRoute>} />
        <Route path="/historique" element={<ProtectedRoute><Historique /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="/marketplace/agriculteur/:id" element={<ProtectedRoute><ProfilAgriculteur /></ProtectedRoute>} />
        <Route path="/panier" element={<ProtectedRoute><Panier panier={JSON.parse(localStorage.getItem('panier') || '[]')} setPanier={(p) => localStorage.setItem('panier', JSON.stringify(p))} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;