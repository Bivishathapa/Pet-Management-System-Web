import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LandingPage from "./pages/landing/landingPage";
import MyServicePage from "./pages/myService/myServicePage";
import AboutUsPage from "./pages/aboutUs/aboutUsPage";
import LoginPage from "./pages/login/loginPage";
import ForgotPasswordPage from "./pages/login/forgotPasswordPage";
import ResetPasswordPage from "./pages/login/resetPasswordPage";
import RegisterPage from "./pages/register/registerPage";
import DashboardRoutes from "./pages/dashboard/DashboardRoutes";
import ListProfessionalPage from "./pages/dashboard/listProfessionals/listProfessionalPage";
import BookNowPage from "./pages/public/bookNowPage";
import { setCredentials } from "./feature/loginSlice";
import AppFooter from "./components/AppFooter";

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
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
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
            path="/my-service"
            element={
              <PublicRoute>
                <MyServicePage />
              </PublicRoute>
            }
          />
          <Route
            path="/about-us"
            element={
              <PublicRoute>
                <AboutUsPage />
              </PublicRoute>
            }
          />
          <Route path="/professionals" element={<ListProfessionalPage />} />
          <Route path="/book-now" element={<BookNowPage />} />

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
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPageWrapper />
              </PublicRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

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
      </div>
      <div className={isDashboardRoute ? 'lg:ml-64' : ''}>
        <AppFooter />
      </div>
    </div>
  );
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onNavigateToRegister={() => navigate('/register')}
      onNavigateToForgotPassword={() => navigate('/forgot-password')}
    />
  );
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  return <RegisterPage onNavigateToLogin={() => navigate('/login')} />;
}

function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();
  return <ForgotPasswordPage onNavigateToLogin={() => navigate('/login')} />;
}

export default App;