import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ActiveConsentCard from './components/ActiveConsentCard';
import PendingRequestCard from './components/PendingRequestCard';
import ConsentHistoryCard from './components/ConsentHistoryCard';
import EmergencyBreakGlass from './components/EmergencyBreakGlass';
import NFTConsentGenerator from './components/NFTConsentGenerator';

const ConsentAccessManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [walletConnected, setWalletConnected] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState('Sepolia');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for active consents
  const activeConsents = [
    {
      id: 'consent_001',
      providerName: 'Dr. Sarah Johnson',
      providerType: 'Cardiologist',
      type: 'routine',
      status: 'active',
      dataCategories: ['Medical History', 'Lab Results', 'Prescriptions'],
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isMultiSig: false,
      nftTokenId: '12345',
      grantedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'consent_002',
      providerName: 'City General Hospital',
      providerType: 'Hospital System',
      type: 'emergency',
      status: 'active',
      dataCategories: ['Medical History', 'Allergies', 'Emergency Contacts', 'Vital Signs'],
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      isMultiSig: true,
      nftTokenId: '12346',
      grantedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'consent_003',
      providerName: 'MedResearch Institute',
      providerType: 'Research Organization',
      type: 'research',
      status: 'active',
      dataCategories: ['Lab Results', 'Imaging Reports'],
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      isMultiSig: false,
      nftTokenId: '12347',
      grantedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock data for pending requests
  const pendingRequests = [
    {
      id: 'request_001',
      providerName: 'Dr. Michael Chen',
      providerType: 'Neurologist',
      priority: 'high',
      requestedData: ['Medical History', 'Imaging Reports', 'Mental Health'],
      duration: '60 days',
      justification: `Patient referral for neurological evaluation following recent headaches and cognitive symptoms. Need access to complete medical history and previous imaging studies to provide comprehensive assessment and treatment recommendations.`,
      providerLicense: 'MD-NY-789456',
      institution: 'Manhattan Neurology Center',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      requiresMultiSig: false,
      requestHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      blockNumber: '18456789'
    },
    {
      id: 'request_002',
      providerName: 'Dr. Lisa Rodriguez',
      providerType: 'Oncologist',
      priority: 'urgent',
      requestedData: ['Medical History', 'Lab Results', 'Imaging Reports', 'Prescriptions'],
      duration: '180 days',
      justification: `Urgent consultation required for abnormal lab results indicating potential malignancy. Immediate access to complete medical records needed for rapid diagnosis and treatment planning. Time-sensitive case requiring comprehensive review.`,
      providerLicense: 'MD-CA-456123',
      institution: 'Stanford Cancer Center',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      requiresMultiSig: true,
      multiSigRequiredCount: 2,
      requestHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      blockNumber: '18456790'
    }
  ];

  // Mock data for consent history
  const consentHistory = [
    {
      id: 'history_001',
      providerName: 'Dr. Sarah Johnson',
      providerType: 'Cardiologist',
      action: 'granted',
      dataCategories: ['Medical History', 'Lab Results', 'Prescriptions'],
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      transactionHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      blockNumber: '18445123',
      gasUsed: '0.0032',
      details: 'Initial consent granted for cardiac evaluation and ongoing treatment monitoring.',
      nftTokenId: '12345'
    },
    {
      id: 'history_002',
      providerName: 'Dr. Robert Kim',
      providerType: 'General Practitioner',
      action: 'revoked',
      dataCategories: ['Medical History', 'Prescriptions'],
      timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      transactionHash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
      blockNumber: '18432456',
      gasUsed: '0.0028',
      details: 'Consent revoked after completion of treatment. Patient requested data access termination.',
      providerAddress: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4'
    },
    {
      id: 'history_003',
      providerName: 'Emergency Contact System',
      providerType: 'Emergency Service',
      action: 'emergency_access',
      dataCategories: ['Medical History', 'Allergies', 'Emergency Contacts', 'Prescriptions'],
      timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      transactionHash: '0x5e6f7890abcdef1234567890abcdef123456789a',
      blockNumber: '18425789',
      gasUsed: '0.0045',
      details: 'Emergency break glass protocol activated during hospital admission. All access logged for audit.',
      providerAddress: '0x853e46Dd7745D5532925a3b8D4C2C4e4C4C4C4C4'
    }
  ];

  // Mock emergency contacts
  const emergencyContacts = [
    {
      name: 'John Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com'
    },
    {
      name: 'Dr. Emily Davis',
      relationship: 'Primary Care Physician',
      phone: '+1 (555) 987-6543',
      email: 'e.davis@medicalpractice.com'
    },
    {
      name: 'Maria Rodriguez',
      relationship: 'Sister',
      phone: '+1 (555) 456-7890',
      email: 'maria.rodriguez@email.com'
    }
  ];

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleNetworkSwitch = () => {
    setCurrentNetwork(currentNetwork === 'Sepolia' ? 'Mainnet' : 'Sepolia');
  };

  const handleEmergencyActivate = async () => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmergencyActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyDeactivate = async () => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmergencyActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeConsent = async (consentId) => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Consent revoked:', consentId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Request approved:', requestId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyRequest = async (requestId) => {
    setIsLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Request denied:', requestId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTransaction = (txHash) => {
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
  };

  const handleGenerateNFTConsent = async (consentData) => {
    setIsLoading(true);
    try {
      // Simulate NFT minting transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('NFT Consent generated:', consentData);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Consents', count: activeConsents?.length, icon: 'Shield' },
    { id: 'pending', label: 'Pending Requests', count: pendingRequests?.length, icon: 'Clock' },
    { id: 'history', label: 'Consent History', count: consentHistory?.length, icon: 'History' },
    { id: 'emergency', label: 'Emergency Access', icon: 'AlertTriangle' },
    { id: 'generate', label: 'Generate NFT', icon: 'Coins' }
  ];

  return (
    <div className="min-h-screen bg-background">
  <Header emergencyConfigured={emergencyContacts?.length > 0} onEmergencyActivate={handleEmergencyActivate} />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Consent & Access Management</h1>
              <p className="text-muted-foreground">Manage healthcare provider permissions and audit access history</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-clinical-green" />
                <span className="text-sm font-medium text-clinical-green">Active</span>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1">{activeConsents?.length}</p>
              <p className="text-xs text-muted-foreground">Active consents</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-clinical-amber" />
                <span className="text-sm font-medium text-clinical-amber">Pending</span>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1">{pendingRequests?.length}</p>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="History" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">History</span>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1">{consentHistory?.length}</p>
              <p className="text-xs text-muted-foreground">Total records</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name={emergencyActive ? "AlertTriangle" : "Users"} size={16} className={emergencyActive ? "text-error" : "text-muted-foreground"} />
                <span className={`text-sm font-medium ${emergencyActive ? "text-error" : "text-muted-foreground"}`}>
                  {emergencyActive ? 'Emergency' : 'Contacts'}
                </span>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1">{emergencyContacts?.length}</p>
              <p className="text-xs text-muted-foreground">Emergency contacts</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm [var(--color-surface-alt)]space-nowrap transition-clinical ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.count !== undefined && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab?.id
                        ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
                    }`}>
                      {tab?.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Active Consents Tab */}
          {activeTab === 'active' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Active Consents</h2>
                <Link to="/emergency-access-contacts">
                  <Button variant="outline" iconName="Settings" iconPosition="left">
                    Manage Contacts
                  </Button>
                </Link>
              </div>

              {activeConsents?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeConsents?.map((consent) => (
                    <ActiveConsentCard
                      key={consent?.id}
                      consent={consent}
                      onRevoke={handleRevokeConsent}
                      onViewDetails={(consent) => console.log('View details:', consent)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="Shield" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Active Consents</h3>
                  <p className="text-muted-foreground mb-4">You haven't granted access to any healthcare providers yet.</p>
                  <Button variant="default" iconName="Plus" iconPosition="left">
                    Generate New Consent
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Pending Requests Tab */}
          {activeTab === 'pending' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Pending Access Requests</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="px-3 py-1 border border-border rounded bg-input text-foreground text-sm">
                    <option>Priority</option>
                    <option>Date</option>
                    <option>Provider</option>
                  </select>
                </div>
              </div>

              {pendingRequests?.length > 0 ? (
                <div className="space-y-6">
                  {pendingRequests?.map((request) => (
                    <PendingRequestCard
                      key={request?.id}
                      request={request}
                      onApprove={handleApproveRequest}
                      onDeny={handleDenyRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="Clock" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">All access requests have been processed.</p>
                </div>
              )}
            </div>
          )}

          {/* Consent History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Consent History</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" iconName="Download" iconPosition="left">
                    Export History
                  </Button>
                  <Button variant="outline" iconName="Filter" iconPosition="left">
                    Filter
                  </Button>
                </div>
              </div>

              {consentHistory?.length > 0 ? (
                <div className="space-y-6">
                  {consentHistory?.map((historyItem) => (
                    <ConsentHistoryCard
                      key={historyItem?.id}
                      historyItem={historyItem}
                      onViewTransaction={handleViewTransaction}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name="History" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No History Available</h3>
                  <p className="text-muted-foreground">Consent history will appear here once you start managing permissions.</p>
                </div>
              )}
            </div>
          )}

          {/* Emergency Access Tab */}
          {activeTab === 'emergency' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Emergency Access Control</h2>
                <Link to="/emergency-access-contacts">
                  <Button variant="outline" iconName="Users" iconPosition="left">
                    Manage Emergency Contacts
                  </Button>
                </Link>
              </div>

              <EmergencyBreakGlass
                isActive={emergencyActive}
                onActivate={handleEmergencyActivate}
                onDeactivate={handleEmergencyDeactivate}
                emergencyContacts={emergencyContacts}
              />
            </div>
          )}

          {/* Generate NFT Tab */}
          {activeTab === 'generate' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">NFT Consent Generator</h2>
                <Button variant="outline" iconName="Info" iconPosition="left">
                  Learn More
                </Button>
              </div>

              <NFTConsentGenerator
                onGenerate={handleGenerateNFTConsent}
                isGenerating={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsentAccessManagement;