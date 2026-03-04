import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../../layouts/layout';
import HomePage from '../dashboard/home/homePage';
import ListProfessionalPage from '../dashboard/listProfessionals/listProfessionalPage';
import GetAppointmentPage from '../dashboard/userappointments/getUserAppointments';
import MyAppointmentsPage from '../dashboard/userappointments/myAppointments';
import UserProfile from '../dashboard/userProfile/userProfile';
import AddPets from '../addPets/addPets';
import Appointments from '../appointments/appointments';
import GroomerAppointmentPage from '../professionalPages/groomerPages/groomerAppointmentPage';
import VetAppointmentPage from '../professionalPages/vetPage/vetAppointmentPage';
import GroomerProfilePage from '../professionalPages/groomerPages/groomerProfilePage';
import VetProfilePage from '../professionalPages/vetPage/vetProfilePage';
import ManageUsersPage from '../adminPages/manageUsersPage';
import ManageProfessionalsPage from '../adminPages/manageProfessionalsPage';
import ProfessionalApplicationsPage from '../adminPages/professionalApplicationsPage';
import ApplyProfessionalPage from '../dashboard/applyProfessional/applyProfessionalPage';
import { DASHBOARD_HOME_BY_ROLE } from '../../constants/dashboardHomeByRole';

const defaultRouteByRole = DASHBOARD_HOME_BY_ROLE;

const allowedRoutesByRole = {
  1: ['/dashboard/manage-users', '/dashboard/manage-professionals', '/dashboard/professional-applications', '/dashboard/profile'],
  2: ['/dashboard/home', '/dashboard/appointments', '/dashboard/add-pets', '/dashboard/professionals', '/dashboard/appointment', '/dashboard/my-appointments', '/dashboard/profile', '/dashboard/apply-professional'],
  3: ['/dashboard/vet-appointments', '/dashboard/vet-profile'],
  4: ['/dashboard/groomer-appointments', '/dashboard/groomer-profile'],
};

function ProtectedRoute({ roleId, path, children }) {
  const allowed = allowedRoutesByRole[roleId] || [];
  if (!allowed.includes(path)) {
    const fallback = defaultRouteByRole[roleId] || '/dashboard/home';
    return <Navigate to={fallback} replace />;
  }
  return children;
}

export default function DashboardRoutes() {
  const authState = useSelector((state) => state.auth);
  const userData = authState?.user?.data || authState?.user;
  const roleId = userData?.user?.roleId;

  const defaultRoute = defaultRouteByRole[roleId] || '/dashboard/home';

  return (
    <Layout>
      <Routes>
        {/* Role 2 (User) routes */}
        <Route
          path="home"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/home">
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="professionals"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/professionals">
              <ListProfessionalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/appointments">
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointment"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/appointment">
              <GetAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-appointments"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/my-appointments">
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-pets"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/add-pets">
              <AddPets />
            </ProtectedRoute>
          }
        />
        <Route
          path="apply-professional"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/apply-professional">
              <ApplyProfessionalPage />
            </ProtectedRoute>
          }
        />

        {/* Shared profile route — each role sees their own profile page */}
        <Route
          path="profile"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/profile">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Role 4 (Groomer) routes */}
        <Route
          path="groomer-appointments"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/groomer-appointments">
              <GroomerAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="groomer-profile"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/groomer-profile">
              <GroomerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Role 3 (Vet) routes */}
        <Route
          path="vet-appointments"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/vet-appointments">
              <VetAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vet-profile"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/vet-profile">
              <VetProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Role 1 (Admin) routes */}
        <Route
          path="manage-users"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/manage-users">
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="manage-professionals"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/manage-professionals">
              <ManageProfessionalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="professional-applications"
          element={
            <ProtectedRoute roleId={roleId} path="/dashboard/professional-applications">
              <ProfessionalApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect to the role's default landing page */}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </Layout>
  );
}