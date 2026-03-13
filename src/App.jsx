import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LandingPage from "./pages/landing/landingPage";
import LoginPage from "./pages/login/loginPage";
import RegisterPage from "./pages/register/registerPage";
import DashboardRoutes from "./pages/dashboard/DashboardRoutes";
import { setCredentials } from "./feature/loginSlice";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && userStr && !isAuthenticated) {
      try {
        const user = JSON.parse(userStr); 
        dispatch(setCredentials({ user, accessToken }));
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Landing Page - public */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPageWrapper />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPageWrapper />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  return <LoginPage onNavigateToRegister={() => navigate('/register')} />;
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  return <RegisterPage onNavigateToLogin={() => navigate('/login')} />;
}

export default App;