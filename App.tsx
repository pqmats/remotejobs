
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { Layout } from './components/Layout';
import { RoleGuard } from './components/RoleGuard';
import { ModalRoot } from './components/ModalRoot';

// Public Pages
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetail } from './pages/JobDetail';
import { Calculator } from './pages/Calculator';
import { Login, Register } from './pages/Auth';
import { Profile } from './pages/Profile';

// Protected Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { Alerts } from './pages/candidate/Alerts';
import { SavedJobs } from './pages/candidate/SavedJobs';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { TalentBank } from './pages/company/TalentBank';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Notifications } from './pages/Notifications';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <HashRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* General Protected */}
              <Route path="/profile" element={
                <RoleGuard allowedRoles={['CANDIDATE', 'COMPANY', 'ADMIN']}>
                  <Profile />
                </RoleGuard>
              } />
              <Route path="/notifications" element={
                <RoleGuard allowedRoles={['CANDIDATE', 'COMPANY', 'ADMIN']}>
                  <Notifications />
                </RoleGuard>
              } />

              {/* Candidate Routes */}
              <Route path="/candidate/dashboard" element={
                <RoleGuard allowedRoles={['CANDIDATE']}>
                  <CandidateDashboard />
                </RoleGuard>
              } />
              <Route path="/candidate/saved-jobs" element={
                <RoleGuard allowedRoles={['CANDIDATE']}>
                  <SavedJobs />
                </RoleGuard>
              } />
              <Route path="/candidate/alerts" element={
                <RoleGuard allowedRoles={['CANDIDATE']}>
                  <Alerts />
                </RoleGuard>
              } />

              {/* Company Routes */}
              <Route path="/company/dashboard" element={
                <RoleGuard allowedRoles={['COMPANY']}>
                  <CompanyDashboard />
                </RoleGuard>
              } />
              <Route path="/company/talent" element={
                <RoleGuard allowedRoles={['COMPANY']}>
                  <TalentBank />
                </RoleGuard>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <RoleGuard allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleGuard>
              } />
            </Routes>
            <ModalRoot />
          </Layout>
        </HashRouter>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
