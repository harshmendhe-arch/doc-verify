import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import VerifyPage from './pages/VerifyPage';
import DocumentsPage from './pages/DocumentsPage';
import ApiDocsPage from './pages/ApiDocsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
