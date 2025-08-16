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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIHealthAssistantAnalysis />} />
        <Route path="/emergency-access-contacts" element={<EmergencyAccessContacts />} />
        <Route path="/ai-health-assistant-analysis" element={<AIHealthAssistantAnalysis />} />
        <Route path="/wallet-connection-authentication" element={<WalletConnectionAuthentication />} />
        <Route path="/health-dashboard-overview" element={<HealthDashboardOverview />} />
        <Route path="/consent-access-management" element={<ConsentAccessManagement />} />
        <Route path="/medical-records-management" element={<MedicalRecordsManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
