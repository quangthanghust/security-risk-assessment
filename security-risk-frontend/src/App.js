import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import HomePage from './pages/HomePage';
import SystemProfilePage from './pages/SystemProfilePage';
import AssetPage from './pages/AssetPage';
import VulnerabilityPage from './pages/VulnerabilityPage';
import ThreatPage from './pages/ThreatPage';
import StrategicScenarioPage from './pages/StrategicScenarioPage';
import OperationScenarioPage from './pages/OperationScenarioPage';
import InterestedPartyPage from './pages/InterestedPartyPage';
import HistoryPage from './pages/HistoryPage';
import StatisticPage from './pages/StatisticPage';
import RiskEvaluationResultPage from './pages/RiskEvaluationResultPage';
import UserManagementPage from './pages/UserManagementPage';
import AdminRoute from './components/common/AdminRoute';

function App() {
  const token = localStorage.getItem('token');

  function LogoutPage() {
    const navigate = useNavigate();
    useEffect(() => {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }, [navigate]);
    return <div>Đang đăng xuất...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Giới thiệu sau đăng nhập */}
        <Route
          path="/gioi-thieu"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Main layout routes */}

        <Route
          path="/he-thong"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SystemProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tai-san"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* Risk Assessment children */}
        <Route
          path="/danh-gia/lo-hong"
          element={
            <ProtectedRoute>
              <MainLayout>
                <VulnerabilityPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-gia/moi-de-doa"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThreatPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-gia/ben-lien-quan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <InterestedPartyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-gia/kich-ban-chien-luoc"
          element={
            <ProtectedRoute>
              <MainLayout>
                <StrategicScenarioPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-gia/kich-ban-van-hanh"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OperationScenarioPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-gia/ket-qua-danh-gia-rui-ro"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RiskEvaluationResultPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lich-su"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/thong-ke"
          element={
            <ProtectedRoute>
              <MainLayout>
                <StatisticPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quan-ly-tai-khoan"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <MainLayout>
                  <UserManagementPage />
                </MainLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Đăng xuất: bạn sẽ xử lý logic logout ở đây */}
        <Route
          path="/dang-xuat"
          element={<LogoutPage />}
        />
        <Route path="*" element={<Navigate to="/gioi-thieu" />} />

        <Route
          path="/"
          element={
            !token
              ? <Navigate to="/login" replace />
              : <Navigate to="/gioi-thieu" replace />
          }
        />
        <Route
          path="*"
          element={
            !token
              ? <Navigate to="/login" replace />
              : <Navigate to="/gioi-thieu" replace />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;