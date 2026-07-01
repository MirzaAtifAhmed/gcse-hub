import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './features/auth/AuthContext';
import { AdminPage } from './pages/AdminPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OfflinePage } from './pages/OfflinePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { PracticePage } from './pages/PracticePage';
import { CurriculumPage } from './pages/CurriculumPage';
import { RegisterPage } from './pages/RegisterPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { SubjectExpansionPage } from './pages/SubjectExpansionPage';
import { TeacherWorkspacePage } from './pages/TeacherWorkspacePage';
import { WorksheetBuilderPage } from './pages/WorksheetBuilderPage';


function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <DashboardPage />;
}

export function App() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute roles={['student']}><PracticePage /></ProtectedRoute>} />
      <Route path="/curriculum" element={<ProtectedRoute><CurriculumPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
      <Route path="/diagnostic" element={<ProtectedRoute roles={['student']}><DiagnosticPage /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute roles={['admin']}><TeacherWorkspacePage /></ProtectedRoute>} />
      <Route path="/worksheets" element={<ProtectedRoute><WorksheetBuilderPage /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><SubjectExpansionPage /></ProtectedRoute>} />

      <Route path="/offline" element={<OfflinePage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </ErrorBoundary>
  );
}
