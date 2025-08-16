import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import EmergencyAccessContacts from './pages/emergency-access-contacts';
import AIHealthAssistantAnalysis from './pages/ai-health-assistant-analysis';
import WalletConnectionAuthentication from './pages/wallet-connection-authentication';
import HealthDashboardOverview from './pages/health-dashboard-overview';
import ConsentAccessManagement from './pages/consent-access-management';
import MedicalRecordsManagement from './pages/medical-records-management';
import ProtectedRoute from './components/ui/ProtectedRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
  {/* Public route: allows users to connect a wallet */}
  <Route path="/wallet-connection-authentication" element={<WalletConnectionAuthentication />} />

  {/* Protected routes: require authenticated session */}
  <Route path="/" element={<ProtectedRoute><AIHealthAssistantAnalysis /></ProtectedRoute>} />
  <Route path="/ai-health-assistant-analysis" element={<ProtectedRoute><AIHealthAssistantAnalysis /></ProtectedRoute>} />
  <Route path="/emergency-access-contacts" element={<ProtectedRoute><EmergencyAccessContacts /></ProtectedRoute>} />
  <Route path="/health-dashboard-overview" element={<ProtectedRoute><HealthDashboardOverview /></ProtectedRoute>} />
  <Route path="/consent-access-management" element={<ProtectedRoute><ConsentAccessManagement /></ProtectedRoute>} />
  <Route path="/medical-records-management" element={<ProtectedRoute><MedicalRecordsManagement /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
