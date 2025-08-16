import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthSummaryCard from './components/HealthSummaryCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActionCards from './components/QuickActionCards';
import ConsentStatusSidebar from './components/ConsentStatusSidebar';
import SecurityStatusIndicator from './components/SecurityStatusIndicator';
import WalletStatusCard from './components/WalletStatusCard';
import Icon from '../../components/AppIcon';
import { fetchRecentActivities } from '../../utils/activityService';
import Skeleton from '../../components/ui/Skeleton';

const HealthDashboardOverview = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [activities, setActivities] = useState([]);
  const [walletConnected, setWalletConnected] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState('Sepolia');
  // Header provided globally via AppLayout

  // Mock data for health summary
  const healthSummary = {
    lastUpdated: "2 hours ago",
    riskLevel: "low",
    keyInsights: [
      "Your blood pressure readings show consistent improvement over the last 3 months",
      "Medication adherence is excellent at 95% compliance rate",
      "Recent lab results indicate optimal vitamin D levels",
      "Sleep patterns have improved significantly since last assessment",
      "Exercise frequency meets recommended guidelines for your age group",
      "Cholesterol levels remain within healthy range"
    ],
    metrics: [
      { label: "Health Score", value: "92/100", status: "Excellent", icon: "Heart" },
      { label: "Risk Factors", value: "2 Low", status: "Managed", icon: "AlertTriangle" },
      { label: "Medications", value: "3 Active", status: "On Track", icon: "Pill" },
      { label: "Last Checkup", value: "2 weeks", status: "Recent", icon: "Calendar" }
    ]
  };

  // Load activities from mock service with latency
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchRecentActivities();
        if (mounted) setActivities(data);
      } finally {
        if (mounted) setIsLoadingDashboard(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Mock data for approved providers
  const approvedProviders = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      permissions: ["Lab Results", "Medications", "Vital Signs"],
      grantedDate: "2025-07-15",
      expiryDate: "2025-09-15"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Internal Medicine",
      permissions: ["Full Access"],
      grantedDate: "2025-06-20",
      expiryDate: "2025-12-20"
    },
    {
      id: 3,
      name: "City General Hospital",
      specialty: "Emergency Department",
      permissions: ["Emergency Records", "Allergies", "Current Medications"],
      grantedDate: "2025-08-01",
      expiryDate: "2025-08-16"
    }
  ];

  // Mock data for active sharing links
  const activeSharingLinks = [
    {
      id: 1,
      name: "Specialist Consultation",
      url: "https://PULSE.app/share/abc123def456",
      expiryDate: "2025-08-17",
      accessCount: 2
    },
    {
      id: 2,
      name: "Insurance Review",
      url: "https://PULSE.app/share/xyz789uvw012",
      expiryDate: "2025-08-20",
      accessCount: 0
    }
  ];

  // Mock data for security status
  const securityStatus = {
    level: "high",
    encryptionLevel: "AES-256",
    lastAudit: "Aug 10",
    features: [
      { name: "End-to-End Encryption", icon: "Lock" },
      { name: "Multi-Signature Access", icon: "Key" },
      { name: "Immutable Audit Trail", icon: "FileCheck" },
      { name: "Zero-Knowledge Proofs", icon: "Eye" }
    ]
  };

  // Mock data for recent access attempts
  const recentAccessAttempts = [
    {
      source: "Dr. Sarah Johnson",
      location: "City Medical Center",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: "authorized"
    },
    {
      source: "Unknown Device",
      location: "New York, NY",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      type: "blocked"
    },
    {
      source: "Mobile App",
      location: "Your Location",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      type: "authorized"
    }
  ];

  // Mock emergency contacts
  const emergencyContacts = [
    { name: "John Smith", relationship: "Spouse" },
    { name: "Dr. Emily Davis", relationship: "Primary Care" },
    { name: "Jane Smith", relationship: "Emergency Contact" }
  ];

  const handleRefreshSummary = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleViewAllActivities = () => {
    navigate('/medical-records-management');
  };

  const handleEmergencyAccess = () => {
    navigate('/emergency-access-contacts');
  };

  const handleRevokeProvider = (providerId) => {
    console.log('Revoking provider:', providerId);
    // Handle provider revocation
  };

  const handleRevokeLink = (linkId) => {
    console.log('Revoking link:', linkId);
    // Handle link revocation
  };

  const handleManageConsent = () => {
    navigate('/consent-access-management');
  };

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleNetworkSwitch = () => {
    setCurrentNetwork(prev => prev === 'Sepolia' ? 'Mainnet' : 'Sepolia');
  };

  // Emergency actions handled in dedicated pages

  const handleCopyDID = () => {
    navigator.clipboard?.writeText('did:ethr:0x1234567890abcdef1234567890abcdef12345678');
  };

  const handleShareDID = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My PULSE DID',
        text: 'My decentralized health identity',
        url: 'did:ethr:0x1234567890abcdef1234567890abcdef12345678'
      });
    }
  };

  return (
  <div>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Icon name="Home" size={16} />
          <span>/</span>
          <span className="text-foreground">Dashboard</span>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your health data and recent activity
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Health Summary */}
            <HealthSummaryCard
              healthSummary={healthSummary}
              onRefresh={handleRefreshSummary}
              isRefreshing={isRefreshing || isLoadingDashboard}
            />

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
              <QuickActionCards onEmergencyAccess={handleEmergencyAccess} isLoading={isLoadingDashboard} />
            </div>

            {/* Recent Activity */}
            <RecentActivityFeed
              activities={activities}
              isLoading={isLoadingDashboard}
              onViewAll={handleViewAllActivities}
            />

            {/* Security Status - Mobile/Tablet */}
            <div className="xl:hidden">
              <SecurityStatusIndicator
                securityStatus={securityStatus}
                recentAccessAttempts={recentAccessAttempts}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Wallet Status */}
            <WalletStatusCard
              walletConnected={walletConnected}
              walletAddress="0x1234567890abcdef1234567890abcdef12345678"
              currentNetwork={currentNetwork}
              userDID="did:ethr:0x1234567890abcdef1234567890abcdef12345678"
              onCopyDID={handleCopyDID}
              onShareDID={handleShareDID}
              onNetworkSwitch={handleNetworkSwitch}
            />

            {/* Security Status - Desktop */}
            <div className="hidden xl:block">
              <SecurityStatusIndicator
                securityStatus={securityStatus}
                recentAccessAttempts={recentAccessAttempts}
              />
            </div>

            {/* Consent Status */}
            <ConsentStatusSidebar
              approvedProviders={approvedProviders}
              activeSharingLinks={activeSharingLinks}
              onRevokeProvider={handleRevokeProvider}
              onRevokeLink={handleRevokeLink}
              onManageConsent={handleManageConsent}
            />
          </div>
        </div>
  </div>
  );
};

export default HealthDashboardOverview;